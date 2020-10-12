import Api from "./api";

/**
 * A wrapper around AccessApi to adapt from Nats to Rest API.
 * We do this because some code used here come from vbus.ts package.
 */
export class ClientAdapter {
    private readonly api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    private convertPath(path: string): string {
        return path.replace(".", "/")
    }

    public getApi(): Api {
        return this.api
    }

    async setAttribute(path: string, value: any) {
        await this.api.services.path(this.convertPath(path)).post(value)
    }

    async readAttribute(path: string): Promise<any> {
        const resp = await this.api.services.path(this.convertPath(path)).getRead()
        return resp.data
    }

    async getElement(path: string): Promise<any> {
        const resp = await this.api.services.path(this.convertPath(path)).get()
        return resp.data
    }

    async callMethod(path: string, ...args: any[]): Promise<any> {
        const resp = await this.api.services.path(this.convertPath(path)).post(args)
        return resp.data
    }

    async callMethodWithTimeout(path: string, timeout: number, ...args: any[]) {
        const resp = await this.api.services.path(this.convertPath(path) + `?timeout=${timeout}`).post(args)
        return resp.data
    }

    async discover(path: string): Promise<any> {
        const resp = await this.api.services.path(this.convertPath(path)).get()
        return resp.data
    }

    async discoverModules(): Promise<any> {
        const resp = await this.api.services.get()
        return resp.data
    }
}
