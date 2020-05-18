import {NodeManager} from "./nodes";
import {ClientAdapter} from "./adapter";
import {ApiOptions} from "./api";
import {Api} from "./index";
import * as models from "./models"

export class Client extends NodeManager {
    constructor(apiOptions: ApiOptions) {
        super(new ClientAdapter(new Api(apiOptions)));
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
