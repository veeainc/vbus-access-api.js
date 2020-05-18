import {getLogger} from "./logger";


const log = getLogger();

export const NOTIF_ADDED = "add";
export const NOTIF_REMOVED = "del";
export const NOTIF_GET = "get";
export const NOTIF_VALUE_GET = "value.get";
export const NOTIF_SETTED = "set";
export const NOTIF_VALUE_SETTED = "value.set";
export const ANONYMOUS_USER = "anonymous";


export function toVbus(obj: any) {
    if (obj === null || obj === undefined) {
        return ""
    }
    return JSON.stringify(obj)
}

export function fromVbus(data: string): any {
    if (data === "" || data === null || data === undefined)
        return null;
    return JSON.parse(data)
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function hasKey(obj: any, key: string): boolean {
    return (typeof obj === 'object' && key in obj)
}

export function arrayEqual(array1: any[], array2: any[]): boolean {
    return array1.length === array2.length && array1.every((element, index) => {
        return element === array2[index];
    });
}

// join path segments to a path (skip empty and null strings)
export function joinPath(...segments: string[]): string {
    return segments.filter(Boolean).join(".")
}

export function isWildcardPath(...parts: string[]): boolean {
    return parts.indexOf("*") > -1
}

export function getPathInObj(o: object, ...segments: string[]): any {
    let root: any = o;
    for (const segment of segments) {
        if (hasKey(root, segment)) { // element exists
            const v = root[segment];
            if (typeof v === "object") {
                root = v
            } else {
                return null
            }
        } else {
            return null
        }
    }
    return root
}
