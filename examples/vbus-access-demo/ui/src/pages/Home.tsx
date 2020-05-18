import React, {useContext, useEffect, useState} from "react";
import VeeaContext from "../VeeaContext"
import {ModuleInfo} from "vbus-access-api/dist/models";
import Layout from "./Layout";
import {useHistory} from "react-router-dom";


export default function HomePage() {
    const history = useHistory()
    const api = useContext(VeeaContext)
    const [data, setData] = useState("")

    useEffect(() => {
        let timer: NodeJS.Timeout = null

        api.discoverModules(1).then(r => {
            const [module] = r.filter(m => m.id === "system.info")
            console.log("module found: ", module)

            api.getRemoteAttr(module.id, module.hostname, "status", "hour").then(attr => {
                timer = setInterval(() => {
                    attr.readValue().then(v => {
                        setData(v)
                    })
                }, 1000)
            }).catch(e => {
                console.log("cannot find remote attr")
            })
        }).catch(r => {
            console.error(r)
        })

        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [api])

    const onServiceClick = (service: ModuleInfo) => () => {
        history.push(`/services?id=${service.id}&host=${service.hostname}`)
    }

    if (data === "") {
        return (
            <Layout>
                loading...
            </Layout>
        )
    }

    return (
        <Layout>
            Hello world, service hour is {data}
        </Layout>
    )
}
