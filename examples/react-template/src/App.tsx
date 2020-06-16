import React from 'react';
import './App.css';
import LoginFinalizePage from "./pages/LoginFinalizePage";
import {BrowserRouter, Route, useHistory} from "react-router-dom";
import VbusAccessContext from "./VeeaContext"

// pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import {Client} from "@veea/vbus-access";


const DEV = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
const baseUrl = DEV ? "http://localhost:8080/api/v1/" : `${window.location.origin}/api/v1/`


function App() {
    const history = useHistory()

    const onUnauthenticated = async (client: Client) => {
        history.push("/login")
    }

    return (
        <div className="App">
            <VbusAccessContext baseUrl={baseUrl} onUnauthenticated={onUnauthenticated}>
                <Route path="/login-finalize" exact>
                    <LoginFinalizePage/>
                </Route>

                <Route path="/login" exact>
                    <LoginPage/>
                </Route>

                <Route path="/" exact>
                    <HomePage/>
                </Route>
            </VbusAccessContext>
        </div>
    );
}

export default App;
