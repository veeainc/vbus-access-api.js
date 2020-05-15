import React from "react";
import logo from "../logo.svg";


export default function Layout({children}: { children: any }) {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <div>
                {children}
            </div>
        </header>
    )
}
