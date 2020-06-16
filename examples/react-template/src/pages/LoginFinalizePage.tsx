import React, {useContext, useEffect} from "react";
import {useLocation, useHistory} from "react-router-dom";
import queryString from 'query-string'
import {Client} from "@veea/vbus-access";
import {ApiContext} from "../VeeaContext"


/**
 * A view to finalize Veea login.
 */
export default function LoginFinalizePage() {
    const client: Client = useContext(ApiContext)
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        (async function asyncJob() {
            const values = queryString.parse(location.search);
            if (client) {
                try {
                    await client.finalizeLogin(values.state as string, values.code as string)
                    window.location.href = "/"
                } catch (e) {
                    console.error(e)
                }
            }
        })();
    }, [client, history, location])

    return (
        <header className="App-header">
            Login in progress...
        </header>
    );
}
