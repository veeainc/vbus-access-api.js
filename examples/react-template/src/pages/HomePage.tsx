import React, {useContext, useEffect, useState} from "react";
import Layout from "../components/Layout";
import {Client} from "@veea/vbus-access";
import {ApiContext} from "../VeeaContext";
import {ModuleInfo} from "@veea/vbus-access/src/models";


function HomePage() {
    const client: Client = useContext(ApiContext)
    const [modules, setModules] = useState<ModuleInfo[]>([])

    useEffect(() => {
        (async function asyncJob() {
            const modules = await client.discoverModules(1)
            setModules(modules)
        })();
    }, [client])

    return (
        <Layout>
            <p>
                Home page
            </p>
            <p>
                Modules:
            </p>
            <div>
                <ul>
                    {
                        modules.map((m, i) => <li key={i}>{m.id} - {m.hostname}</li>)
                    }
                </ul>
            </div>
        </Layout>
    )
}


export default HomePage
