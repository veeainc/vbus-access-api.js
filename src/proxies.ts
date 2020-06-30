import {getPathInObj, hasKey, isWildcardPath, joinPath} from "./helpers";
import {isAttribute, isMethod, isNode} from "./definitions";
import {getLogger} from "./logger";
import {ClientAdapter} from "./adapter";
import {JSONSchema7} from 'json-schema'

const log = getLogger();

/**
 * Subscription callback type.
 */
type ProxySubCallback = (proxy: UnknownProxy, segments: string[]) => void

/**
 * Represents common proxy actions.
 * @class Proxy
 * @abstract
 */
abstract class Proxy {
    protected readonly client: ClientAdapter = null;
    protected readonly path: string;
    protected readonly name: string;
    protected readonly rawDef: any;

    /**
     * Creates a new Proxy.
     * @param client {ClientAdapter} The client
     * @param path {string} Vbus path
     * @param rawDef {object} Raw Vbus elements
     */
    protected constructor(client: ClientAdapter, path: string, rawDef: any) {
        this.client = client;
        this.path = path;
        this.name = path.split(".").pop();
        this.rawDef = rawDef;
    }

    /**
     * Convert element to string.
     * @return {string}
     */
    toString(): string {
        return JSON.stringify(this.rawDef, null, 2);
    }

    /**
     * Retrieve element path.
     * @return {string}
     */
    getPath(): string {
        return this.path
    }

    /**
     * Retrieve element name.
     * @return {string}
     */
    getName(): string {
        return this.name
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Unknown Proxy
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * When we don't know in advance the object type, we use an UnknownProxy.<br/>
 * For example, when we subscribe to a path, the library will return an UnknownProxy.<br/>
 * Then you will have to assert it to the correct type using IsAttribute, IsMethod...
 * @class UnknownProxy
 * @extends Proxy
 */
export class UnknownProxy extends Proxy {
    /**
     * Creates a new UnknownProxy.
     * @param client {ClientAdapter} The client
     * @param path {string} Vbus path
     * @param rawDef {object} Raw Vbus elements
     */
    constructor(client: ClientAdapter, path: string, rawDef: object) {
        super(client, path, rawDef);
    }

    /**
     * Is it an attribute ?
     * @return {boolean} true if it's an attribute
     */
    isAttribute(): boolean {
        return isAttribute(this.rawDef)
    }

    /**
     * Get an AttributeProxy (use IsAttribute before).
     * @return {AttributeProxy}
     */
    asAttribute(): AttributeProxy {
        return new AttributeProxy(this.client, this.path, this.rawDef)
    }

    /**
     * Is it a method ?
     * @return {boolean} true if it's a method
     */
    isMethod(): boolean {
        return isMethod(this.rawDef)
    }

    /**
     * Get an MethodProxy (use IsMethod before).
     * @return {MethodProxy}
     */
    asMethod(): MethodProxy {
        return new MethodProxy(this.client, this.path, this.rawDef)
    }

    /**
     * Is it a node ?
     * @return {boolean} true if it's a noe
     */
    isNode(): boolean {
        return isNode(this.rawDef)
    }

    /**
     * Get a NodeProxy (use IsMethod before).
     * @return {NodeProxy}
     */
    asNode(): NodeProxy {
        return new NodeProxy(this.client, this.path, this.rawDef)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Attribute Proxy
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *  Represents remote attribute actions.
 *  @class AttributeProxy
 *  @extends Proxy
 */
export class AttributeProxy extends Proxy {
    /**
     * Creates a new AttributeProxy.
     * @param client {ClientAdapter} The client
     * @param path {string} Vbus path
     * @param rawDef {object} Raw Vbus elements
     */
    constructor(client: ClientAdapter, path: string, rawDef: object) {
        super(client, path, rawDef);
    }

    /**
     * Get value in tree (cache).
     * @return any
     */
    getValue(): any {
        if (hasKey(this.rawDef, "value")) {
            return this.rawDef.value
        } else {
            return null
        }
    }

    /**
     * Set remote value.
     * @async
     * @param value {any}
     */
    async setValue(value: any) {
        await this.client.setAttribute(this.getPath(), value)
    }

    /**
     * Get remote value.
     * @async
     * @return {Promise<any>}
     */
    async readValue(): Promise<any> {
        return await this.client.readAttribute(this.getPath())
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Node Proxy
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Represents remote node actions.
 * @class NodeProxy
 * @extends Proxy
 */
export class NodeProxy extends Proxy {
    /**
     * Creates a new NodeProxy.
     * @param client {ClientAdapter} The client
     * @param path {string} Vbus path
     * @param rawDef {object} Raw Vbus elements
     */
    constructor(client: ClientAdapter, path: string, rawDef: object) {
        super(client, path, rawDef);
    }

    /**
     * Return raw node tree.
     * @return {object}
     */
    getTree(): object {
        return this.rawDef
    }

    /**
     * Retrieve a remote node.
     * @async
     * @param parts {string[]} example: "system", "zigbee", "..."
     * @return {Promise<NodeProxy>}
     */
    async getNode(...parts: string[]): Promise<NodeProxy> {
        if (isWildcardPath(...parts)) {
            throw Error("Wildcard proxy not yet implemented")
        } else {
            const rawElementDef = getPathInObj(this.rawDef, ...parts);
            if (rawElementDef) {
                return new NodeProxy(this.client, joinPath(this.getPath(), ...parts), rawElementDef)
            } else { // load from vbus
                const resp = await this.client.getElement(joinPath(...parts))
                if (resp) {
                    if (typeof resp === "object") {
                        return new NodeProxy(this.client, joinPath(this.getPath(), ...parts), resp)
                    } else {
                        return null
                    }
                }
            }
        }
    }

    /**
     * Retrieve a remote method.
     * @async
     * @param parts {string[]} example: "system", "zigbee", "..."
     * @return {Promise<MethodProxy>}
     */
    async getMethod(...parts: string[]): Promise<MethodProxy> {
        if (isWildcardPath(...parts)) {
            throw Error("Wildcard proxy not yet implemented")
        } else {
            const rawElementDef = getPathInObj(this.rawDef, ...parts);
            if (rawElementDef) {
                return new MethodProxy(this.client, joinPath(this.getPath(), ...parts), rawElementDef)
            } else { // load from vbus
                const resp = await this.client.getElement(joinPath(...parts))
                if (resp) {
                    if (typeof resp === "object") {
                        return new MethodProxy(this.client, joinPath(this.getPath(), ...parts), resp)
                    } else {
                        return null
                    }
                }
            }
        }
    }

    /**
     * Retrieve a remote attribute.
     * @async
     * @param parts {string[]} example: "system", "zigbee", "..."
     * @return {Promise<AttributeProxy>}
     */
    async getAttribute(...parts: string[]): Promise<AttributeProxy> {
        if (isWildcardPath(...parts)) {
            throw Error("Wildcard proxy not yet implemented")
        } else {
            const rawElementDef = getPathInObj(this.rawDef, ...parts);
            if (rawElementDef) {
                return new AttributeProxy(this.client, joinPath(this.getPath(), ...parts), rawElementDef)
            } else { // load from vbus
                const resp = await this.client.getElement(joinPath(...parts))
                if (resp) {
                    if (typeof resp === "object") {
                        return new AttributeProxy(this.client, joinPath(this.getPath(), ...parts), resp)
                    } else {
                        return null
                    }
                }
            }
        }
    }

    /**
     * Retrieve a map of elements in this node.
     */
    elements(): { [uuid: string]: UnknownProxy } {
        const elements: { [key: string]: any } = {};
        for (const uuid of Object.keys(this.rawDef)) {
            const v = this.rawDef[uuid];
            if (typeof v === "object") {
                elements[uuid] = new UnknownProxy(this.client, joinPath(this.getPath(), uuid), v)
            } else {
                log.warn("skipping unknown object: %s", JSON.stringify(v))
            }
        }
        return elements
    }

    /**
     * Retrieve a map with only attributes.
     */
    attributes(): { [uuid: string]: AttributeProxy } {
        const elements: { [key: string]: any } = {};
        for (const uuid of Object.keys(this.rawDef)) {
            const v = this.rawDef[uuid];
            if (isAttribute(v)) {
                elements[uuid] = new AttributeProxy(this.client, joinPath(this.getPath(), uuid), v)
            } else {
                log.warn("skipping unknown object: %s", JSON.stringify(v))
            }
        }
        return elements
    }

    /**
     * Retrieve a map with only methods.
     */
    methods(): { [uuid: string]: MethodProxy } {
        const elements: { [key: string]: any } = {};
        for (const uuid of Object.keys(this.rawDef)) {
            const v = this.rawDef[uuid];
            if (isMethod(v)) {
                elements[uuid] = new MethodProxy(this.client, joinPath(this.getPath(), uuid), v)
            } else {
                log.warn("skipping unknown object: %s", JSON.stringify(v))
            }
        }
        return elements
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Method Proxy
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Represents remote method actions.
 * @class MethodProxy
 * @extends Proxy
 */
export class MethodProxy extends Proxy {
    /**
     * Creates a new MethodProxy.
     * @param client {ClientAdapter} The client
     * @param path {string} Vbus path
     * @param rawDef {object} Raw Vbus elements
     */
    constructor(client: ClientAdapter, path: string, rawDef: object) {
        super(client, path, rawDef);
    }

    /**
     * Call a remote method with arguments.
     * @async
     * @param args {any[]} Method arguments
     * @return {Promise<any>} Return value
     */
    async call(...args: any[]): Promise<any> {
        return await this.client.callMethod(this.getPath(), args)
    }

    /**
     * Call a remote method with arguments and with a timeout
     * @async
     * @param timeoutMs Timeout in ms
     * @param args {any[]} Method arguments
     * @return {Promise<any>} Return value
     */
    async callWithTimeout(timeoutMs: number, ...args: any[]): Promise<any> {
        return await this.client.callMethodWithTimeout(this.getPath(), timeoutMs, args)
    }

    /**
     * Get method parameters Json Schema.
     * @return {JSONSchema7}
     */
    getParamsSchema(): JSONSchema7 {
        return this.rawDef['params']['schema']
    }

    /**
     * Get method returns Json Schema.
     * @return {JSONSchema7}
     */
    getReturnsSchema(): JSONSchema7 {
        return this.rawDef['returns']['schema']
    }
}
