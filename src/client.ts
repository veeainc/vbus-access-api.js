import {NodeManager} from "./nodes";
import {ClientAdapter} from "./adapter";
import Api, {ApiOptions} from "./api";
import * as models from "./models"
import {ApiStorage} from "./storages";
import {ModuleInfo} from "./models";

/**
 * Represents client options.
 */
export interface ClientOptions {
    /**
     * Vbus access base url.
     */
    baseUrl: string

    /**
     * Jwt token storage type.
     */
    storage: ApiStorage

    /**
     * Called when a request fail with an authentication error.
     */
    onUnauthenticated?: (client: Client) => Promise<void>
}

/**
 * The Vbus in-browser client.
 * @class Client
 * @extends NodeManager
 */
export class Client extends NodeManager {
    /**
     * Creates a new client. <br/>
     * In order to use it, you must follow authentication steps:
     * <pre>
     *   1. redirect the user to external login screen using {@link Client#getLoginView}
     *   2. authenticate sending back the state and the code with {@link Client#finalizeLogin}
     * </pre>
     * @param {ClientOptions} clientOptions Client options.
     */
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
     * @async
     * @param returnUrl {string} The url where the user will be redirected after login
     * @return {Promise<LoginResp>}
     */
    async getLoginView(returnUrl: string): Promise<models.LoginResp> {
        const resp = await this.client.getApi().login.post({returnUrl: returnUrl})
        return resp.data
    }

    /**
     * After login screen, you need to post the code and the state obtained in the login screen.
     * @async
     * @param state {string}
     * @param code {string}
     * @return {Promise<LoginFinalizeResp>}
     */
    async finalizeLogin(state: string, code: string): Promise<models.LoginFinalizeResp> {
        const resp = await this.client.getApi().login.finalize.post({code, state})
        return resp.data
    }

    /**
     * Retrieve logout external view url.
     * @async
     * @param returnUrl {string} The url where the user will be redirected after logout
     * @return {Promise<LogoutResp>}
     */
    async getLogoutView(returnUrl: string): Promise<models.LogoutResp> {
        const resp = await this.client.getApi().logout.post({returnUrl: returnUrl})
        return resp.data
    }

    /**
     * Tells if the client is authenticated.
     * @async
     * @return {Promise<boolean>} true if authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        return await this.client.getApi().isAuthenticated()
    }

    /**
     * Given a module info structure, it builds a static file url.
     * @param module {ModuleInfo} info retrieved with discoverModules()
     */
    getStaticUrlFor(module: ModuleInfo): string {
        const parts = module.id.split('.')
        return `http://${this.client.getApi().baseUrl}static/${parts[0]}/${parts[1]}/${module.hostname}/index.html`
    }

    addAuthListener(listener: () => void) {
        this.client.getApi().addAuthListener(listener)
    }

    removeAuthListener(listener: () => void) {
        this.client.getApi().removeAuthListener(listener)
    }
}
