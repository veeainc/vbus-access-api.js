import React, {useContext, useEffect} from "react";
import {Client} from "@veea/vbus-access";
import {ApiContext} from "../VeeaContext"


/**
 * A view to redirect user to external Veea login page.
 */
export default function LoginPage() {
    const client: Client = useContext(ApiContext)
    const returnUrl = window.location.origin + "/login-finalize";

    useEffect(() => {
        client.getLoginView(returnUrl).then(r => {
            window.location.href = r.viewUrl
        }).catch(r => {
            console.error(r)
        })
    }, [client, returnUrl])

    return (
        <header className="App-header">
            Login in progress...
        </header>
    );
}
