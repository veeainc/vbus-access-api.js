import {arrayEqual, hasKey} from "./helpers";
import {getLogger} from "./logger";

const log = getLogger();

export abstract class Definition {
    // Search for a path in this definition.
    // It can returns a iDefinition or none if not found.
    searchPath(parts: string[]): Definition {
        if (parts.length <= 0) {
            return this
        }
        return null
    }

    // Tells how to handle a set request from Vbus.
    abstract handleSet(data: any, parts: string[]): any;

    // Tells how to handle a set request from Vbus.
    handleGet(data: any, parts: string[]): any {
        return this.toRepr()
    }

    // Get the Vbus representation.
    abstract toRepr(): object;
}

// Tells if a raw node is an attribute.
export function isAttribute(node: any): boolean {
    return hasKey(node, "schema")
}

// Tells if a raw node is a method.
export function isMethod(node: any): boolean {
    return hasKey(node, "params") && hasKey(node, "returns")
}

// Tells if a raw node is a node.
export function isNode(node: any): boolean {
    return !isAttribute(node) && !isMethod(node) && typeof node === "object"
}

export type SetCallback = (data: any, segment: string[]) => void;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Node iDefinition
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export type RawNode = { [key: string]: any }
type NodeStruct = { [uuid: string]: Definition }

/**
 * A node definition.
 * @class NodeDef
 */
export class NodeDef extends Definition {
    private readonly structure: NodeStruct = null;
    private readonly onSet: SetCallback = null;

    constructor(rawNode: RawNode, onSet: SetCallback = null) {
        super();
        this.structure = this.initializeStructure(rawNode);
        this.onSet = onSet;
    }

    private initializeStructure(rawNode: RawNode): NodeStruct {
        const structure: NodeStruct = {};

        for (const k in rawNode) {
            if (rawNode.hasOwnProperty(k)) {
                const val = rawNode[k];
                if (val instanceof Definition) { // already a def
                    structure[k] = val
                } else if (typeof val === "object") { // a rawnode
                    structure[k] = new NodeDef(val)
                } else { // Raw attribute
                    throw new Error("unknown type in node definition: " + val)
                }
            }
        }
        return structure
    }

    searchPath(parts: string[]): Definition {
        if (parts.length <= 0) {
            return this
        } else if (parts[0] in this.structure) { // recurse
            return this.structure[parts[0]].searchPath(parts.slice(1))
        }
        return null
    }

    handleSet(data: any, parts: string[]): any {
        if (this.onSet) {
            return this.onSet(data, parts)
        }
        log.debug("no onSet handler");
        return null
    }

    toRepr(): object {
        const repr: {[key: string]: any} = {};

        // tslint:disable-next-line:forin
        for (const k in this.structure) {
            const v = this.structure[k];
            repr[k] = v.toRepr()
        }

        return repr
    }

    addChild(uuid: string, definition: Definition) {
        this.structure[uuid] = definition;
    }

    removeChild(uuid: string): Definition {
        if (uuid in this.structure) {
            const val = this.structure[uuid];
            delete this.structure[uuid];
            return val
        }
        return null
    }
}





