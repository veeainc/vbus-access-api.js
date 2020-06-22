import {Definition, NodeDef} from "./definitions";
import {joinPath} from "./helpers";
import {AttributeProxy, MethodProxy, NodeProxy, UnknownProxy} from "./proxies";
import {ClientAdapter} from "./adapter";
import {ModuleInfo} from "./models";


/**
 * Represents a vBus element.
 * @class Element
 */
export abstract class Element {
    protected readonly client: ClientAdapter = null;
    protected readonly uuid: string;
    protected readonly definition: Definition = null;
    protected readonly parent: Element = null;

    /**
     * Creates a new Element.
     * @param client {ClientAdapter} client
     * @param uuid {string} element uuid
     * @param definition {Definition} element definition
     * @param parent {Element} parent
     */
    protected constructor(client: ClientAdapter, uuid: string, definition: Definition, parent: Element) {
        this.client = client;
        this.uuid = uuid;
        this.definition = definition;
        this.parent = parent;
    }

    /**
     * Get element uuid.
     * @return {string}
     */
    getUuid(): string {
        return this.uuid;
    }

    /**
     * Get element definition.
     * @return {Definition}
     */
    getDefinition(): Definition {
        return this.definition;
    }

    /**
     * Get element path.
     * @return {string}
     */
    getPath(): string {
        if (this.parent) {
            return joinPath(this.parent.getPath(), this.uuid)
        } else {
            return this.uuid
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Node
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A Vbus connected node.
 * It contains a node definition and send update over Vbus.
 * @class Node
 */
export class Node extends Element {
    /**
     * Creates a new Node.
     * @param client {ClientAdapter} client
     * @param uuid {string} node uuid
     * @param definition {NodeDef} node definition
     * @param parent {Element} node parent
     */
    constructor(client: ClientAdapter, uuid: string, definition: NodeDef, parent: Element) {
        super(client, uuid, definition, parent);
    }

    /**
     * Dump this node to string.
     * @return {string}
     */
    toString(): string {
        return JSON.stringify(this.definition.toRepr(), null, 2);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Node Manager
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The NodeManager handle high level action like discovering nodes.
 * @class NodeManager
 * @extends Node
 */
export class NodeManager extends Node {
    private urisNode: Node = null;

    constructor(client: ClientAdapter) {
        super(client, "", new NodeDef({}), null);
    }

    /**
     * Discover running Vbus modules.
     * @async
     * @param timeout {number} FIXME: not used for now.
     * @return {Promise<ModuleInfo[]>} Discovered modules.
     */
    async discoverModules(timeout: number): Promise<ModuleInfo[]> {
        return await this.client.discoverModules()
    }

    /**
     * Discover elements.
     * @param path {string} Vbus path
     * @async
     * @param timeoutMs {number} Timeout in ms
     * @return {Promise<UnknownProxy>}
     */
    async discover(path: string, timeoutMs: number): Promise<UnknownProxy> {
        const element = await this.client.discover(path)
        return new UnknownProxy(this.client, path, element)
    }

    /**
     * Retrieve a proxy on a remote node.
     * @async
     * @param parts {string[]} node path
     * @return {Promise<NodeProxy>}
     */
    async getRemoteNode(...parts: string[]): Promise<NodeProxy> {
        return await new NodeProxy(this.client, "", {}).getNode(...parts)
    }

    /**
     * Retrieve a proxy on a remote attribute.
     * @async
     * @param parts {string[]} attribute path
     * @return {Promise<AttributeProxy>}
     */
    async getRemoteAttr(...parts: string[]): Promise<AttributeProxy> {
        return await new NodeProxy(this.client, "", {}).getAttribute(...parts)
    }

    /**
     * Retrieve a proxy on a remote method.
     * @async
     * @param parts {string[]} method path
     * @return {Promise<MethodProxy>}
     */
    async getRemoteMethod(...parts: string[]): Promise<MethodProxy> {
        return await new NodeProxy(this.client, "", {}).getMethod(...parts)
    }
}






