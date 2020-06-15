import {Definition, NodeDef} from "./definitions";
import {joinPath} from "./helpers";
import {AttributeProxy, MethodProxy, NodeProxy, UnknownProxy} from "./proxies";
import {ClientAdapter} from "./adapter";
import {ModuleInfo} from "./models";


export abstract class Element {
    protected readonly client: ClientAdapter = null;
    protected readonly uuid: string;
    protected readonly definition: Definition = null;
    protected readonly parent: Element = null;

    protected constructor(client: ClientAdapter, uuid: string, definition: Definition, parent: Element) {
        this.client = client;
        this.uuid = uuid;
        this.definition = definition;
        this.parent = parent;
    }

    getUuid(): string {
        return this.uuid;
    }

    getDefinition(): Definition {
        return this.definition;
    }

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

// A Vbus connected node.
// It contains a node definition and send update over Vbus.
export class Node extends Element {
    constructor(client: ClientAdapter, uuid: string, definition: NodeDef, parent: Element) {
        super(client, uuid, definition, parent);
    }

    toString(): string {
        return JSON.stringify(this.definition.toRepr(), null, 2);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Node Manager
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The NodeManager handle high level action like discovering nodes.
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

    async getRemoteNode(...parts: string[]): Promise<NodeProxy> {
        return await new NodeProxy(this.client, "", {}).getNode(...parts)
    }

    async getRemoteAttr(...parts: string[]): Promise<AttributeProxy> {
        return await new NodeProxy(this.client, "", {}).getAttribute(...parts)
    }

    async getRemoteMethod(...parts: string[]): Promise<MethodProxy> {
        return await new NodeProxy(this.client, "", {}).getMethod(...parts)
    }
}






