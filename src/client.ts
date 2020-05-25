import {NodeManager} from "./nodes";
import {ClientAdapter} from "./adapter";
import Api, {ApiOptions} from "./api";
import * as models from "./models"
import {ApiStorage} from "./storages";


export interface ClientOptions {
    baseUrl: string
    storage: ApiStorage

    /**
     * Called when a request fail with an authentication error.
     */
    onUnauthenticated?: (client: Client) => Promise<void>
}

export class Client extends NodeManager {
    constructor(clientOptions: ClientOptions) {
        super(new ClientAdapter(new Api({
            baseUrl: clientOptions.baseUrl,
            storage: clientOptions.storage,
            onUnauthenticated: api => {
                if (clientOptions.onUnauthenticated) {
                    return clientOptions.onUnauthenticated(this)
                }
            }
        })));
    }

    /**
     * Retrieve login view url.
     * The login screen in an external Veea service.
     * @param returnUrl The url where the user will be redirected ater login
     */
    async getLoginView(returnUrl: string): Promise<models.LoginResp> {
        const resp = await this.client.getApi().login.post({returnUrl: returnUrl})
        return resp.data
    }

    /**
     * After login screen, you need to post the code and the state obtained in the login screen.
     * @param state
     * @param code
     */
    async finalizeLogin(state: string, code: string): Promise<models.LoginFinalizeResp> {
        const resp = await this.client.getApi().login.finalize.post({code, state})
        return resp.data
    }

    async getLogoutView(returnUrl: string): Promise<models.LogoutResp> {
        const resp = await this.client.getApi().logout.post({returnUrl: returnUrl})
        return resp.data
    }
}
