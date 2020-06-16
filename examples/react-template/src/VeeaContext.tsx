import React, {createContext} from "react";
import {Client, LocalStorage, ApiStorage} from "@veea/vbus-access";

// Access API React context
export const ApiContext = createContext<Client|null>(null);

export interface VbusAccessContextProps {
    children: React.ReactNode
    baseUrl?: string
    storage?: ApiStorage
    onUnauthenticated?: (client: Client) => Promise<void>
}

/**
 * The Vbus access context.
 * By default: baseUrl is set to `${origin}/api/v1/`
 * and storage to new LocalStorage()
 * @constructor
 */
export default function VbusAccessContext(props: VbusAccessContextProps) {
    const origin = window.location.origin
    const client = new Client({
        baseUrl: props.baseUrl ? props.baseUrl : `${origin}/api/v1/`,
        storage: props.storage ? props.storage : new LocalStorage(),
        onUnauthenticated: props.onUnauthenticated
    });

    return (
        <ApiContext.Provider value={client}>
            {props.children}
        </ApiContext.Provider>
    )
}
