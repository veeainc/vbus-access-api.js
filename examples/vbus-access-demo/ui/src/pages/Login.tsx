import React, {useContext, useEffect} from "react";
import {useLocation, useHistory} from "react-router-dom";
import queryString from 'query-string'
import VeeaContext from "../VeeaContext";


export default function Login() {
    const api = useContext(VeeaContext)
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        const values = queryString.parse(location.search);

        api.login.finalize.post({
            code: values.code as string,
            state: values.state as string,
        }).then(r => {
            history.push("/")
        }).catch(r => {
            console.error(r.response)
        });
    }, [api, history, location])

    return (
        <header className="App-header">
            Login page
        </header>
    );
}
