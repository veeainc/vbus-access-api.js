import React from 'react';
import './App.css';
import {BrowserRouter, Route, useHistory} from "react-router-dom";
import VbusAccessContext from "./VeeaContext"

// pages
import HomePage from "./pages/HomePage";
import {Client} from "@veea/vbus-access";


const DEV = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
const baseUrl = DEV ? "http://localhost:8080/api/v1/" : `${window.location.origin}/api/v1/`


function App() {
    const history = useHistory()

    const onUnauthenticated = async (client: Client) => {
        // ask the user to login into the dashboard
    }

    return (
        <div className="App">
            <VbusAccessContext baseUrl={baseUrl} onUnauthenticated={onUnauthenticated}>
                <Route path="/">
                    <HomePage/>
                </Route>
            </VbusAccessContext>
        </div>
    );
}

export default App;
