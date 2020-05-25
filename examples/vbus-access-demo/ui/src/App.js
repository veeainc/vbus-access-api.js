import React from 'react';
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import createApi, {LocalStorage} from "vbus-access-api";
import VeeaContext from "./VeeaContext"
import {useLocation} from "react-router";
import queryString from "query-string";


export default function App() {
    const location = useLocation()
    const query = queryString.parse(location.search);
    const route = query.route

    const origin = window.location.origin
    const api = createApi({
        baseUrl: `${origin}/api/v1/`,
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

    const isLogin = (query.code !== undefined && query.state !== unescape)

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

