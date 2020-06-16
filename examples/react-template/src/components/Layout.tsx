import React from "react";


export default function Layout({children}: { children: any }) {
    return (
        <header className="App-header">
            <div>
                {children}
            </div>
        </header>
    )
}
