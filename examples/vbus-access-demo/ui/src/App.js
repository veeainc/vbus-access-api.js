import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import createApi, {LocalStorage} from "vbus-access-api";
import VeeaContext from "./VeeaContext"
import {useLocation} from "react-router";
import queryString, {stringify} from "query-string";

const api = createApi({
    baseUrl: "http://localhost:8080/api/v1/",
    storage: new LocalStorage(),
    onUnauthenticated: (api) => {
        console.log('onUnauthenticated');
        return api.login.post({
            returnUrl: window.location.href
        }).then(r => {
            window.location.replace(r.data.viewUrl)
        }).catch(r => {
            console.error(r)
        })
    }
});

export default function App() {
    const location = useLocation()
    const query = queryString.parse(location.search);
    const route = query.route

    const isLogin = (query.code !== undefined && query.state !== unescape)
    console.log("route: ", route, isLogin)

    return (
        <div className="App">
            <VeeaContext.Provider value={api}>
                {
                    isLogin && <Login/>
                }
                {
                    !isLogin && <Home/>
                }
            </VeeaContext.Provider>
        </div>
    );
}

