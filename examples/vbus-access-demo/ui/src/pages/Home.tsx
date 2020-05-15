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

        api.services.get().then(r => {
            const [module] = r.data.filter(m => m.id === "system.info")
            console.log("module found: ", module)

            timer = setInterval(() => {
                const [domain, name] = module.id.split(".")
                api.services.domain(domain).name(name).host(module.hostname).path("status/hour").readAttr().then(r => {
                    // @ts-ignore
                    setData(r.data as string)
                })
            }, 1000)

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
