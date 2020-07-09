import {NodeManager} from "./nodes";
import {ClientAdapter} from "./adapter";
import Api, {ApiOptions} from "./api";
import * as models from "./models"
import {ApiStorage, LocalStorage} from "./storages";
import {ModuleInfo} from "./models";
import {getLogger} from "./logger";


const logger = getLogger()

/**
 * Represents client options.
 */
export interface ClientOptions {
    /**
     * Vbus access base url.
     */
    baseUrl: string

    /**
     * Called when a request fail with an authentication error.
     */
    onUnauthenticated?: (client: Client) => Promise<void>
}

function parseQuery(queryString) {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

/**
 * Init response.
 */
export interface InitResponse {
    /**
     * Tell is the user is authenticated
     */
    authenticated: boolean

    /**
     * If authenticated, it will contains user information.
     */
    information?: models.LoginFinalizeResp
}

const userInfoKey = 'v1:user:info'

/**
 * The Vbus in-browser client.
 * @class Client
 * @extends NodeManager
 */
export class Client extends NodeManager {
    public readonly baseUrl: string = ""
    private initialized: boolean = false;

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
            storage: new LocalStorage(),
            onUnauthenticated: api => {
                if (clientOptions.onUnauthenticated) {
                    return clientOptions.onUnauthenticated(this)
                }
            }
        })));

        // init base url with current iframe location
        const parts = window.location.href.split('/')
        const idx = parts.indexOf("static")
        this.baseUrl = parts.slice(0, idx + 4).join("/")
    }

    /**
     * Initializes the client.
     */
    async init(): Promise<InitResponse> {
        try {
            // detect auth redirection
            if (window.location.pathname.startsWith("/auth/callback")) {
                const query = parseQuery(window.location.search)
                if ('state' in query && 'code' in query) {
                    const resp = await this.finalizeLogin(query['state'], query['code'])
                    logger.debug("finalize resp: ", resp)

                    // store user information for latter use
                    const storage = this.client.getApi().getStorage()
                    await storage.storeObject(userInfoKey, resp)

                    window.location.replace(resp.returnUrl)

                    return {
                        authenticated: true,
                        information: resp
                    }
                } else {
                    throw new Error("Invalid query string")
                }
            } else if (await this.isAuthenticated()) {
                // else check if we are already authenticated
                // JWT token i storage + infos
                const storage = this.client.getApi().getStorage()
                try {
                    const info = await storage.readObject(userInfoKey)
                    return {
                        authenticated: true,
                        information: info as models.LoginFinalizeResp
                    }
                } catch (e) {
                    logger.warn(e)
                    await storage.removeItem('v1:user:info')
                    return {
                        authenticated: false
                    }
                }
            } else {
                // we are not authenticated
                return {
                    authenticated: false
                }
            }
        } finally {
            this.initialized = true
        }
    }

    /**
     * Ensure that the client is initialized.
     */
    private ensureInitialized() {
        if (!this.initialized) {
            throw new Error('Client is not initialized, ensure calling client.init() once')
        }
    }

    /**
     * Retrieve login view url.
     * The login screen in an external Veea service.
     * @async
     * @return {Promise<LoginResp>}
     */
    async login(): Promise<models.LoginResp> {
        this.ensureInitialized()
        const resp = await this.client.getApi().login.post({
            origin: window.location.origin,
            returnUrl: window.location.href,
        })

        if (!resp.data.authenticated) {
            window.location.replace(resp.data.redirect)
        }

        return resp.data
    }

    /**
     * After login screen, you need to post the code and the state obtained in the login screen.
     * @async
     * @param state {string}
     * @param code {string}
     * @return {Promise<LoginFinalizeResp>}
     */
    private async finalizeLogin(state: string, code: string): Promise<models.LoginFinalizeResp> {
        const resp = await this.client.getApi().login.finalize.post({
            origin: window.location.origin,
            code, state
        })
        return resp.data
    }

    /**
     * Retrieve logout external view url.
     * @async
     * @param returnUrl {string} The url where the user will be redirected after logout
     * @return {Promise<LogoutResp>}
     */
    async getLogoutView(returnUrl: string): Promise<models.LogoutResp> {
        this.ensureInitialized()
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

    /***
     * Get user info, if user is authenticated.
     */
    async getUserInfo(): Promise<models.LoginFinalizeResp> {
        const storage = this.client.getApi().getStorage()
        return await storage.readObject(userInfoKey) as models.LoginFinalizeResp
    }

    /**
     * Given a module info structure, it builds a static file url.
     * @param module {ModuleInfo} info retrieved with discoverModules()
     */
    getStaticUrlFor(module: ModuleInfo): string {
        this.ensureInitialized()
        const parts = module.id.split('.')
        return `${this.client.getApi().baseUrl}static/${parts[0]}/${parts[1]}/${module.hostname}/index.html`
    }

    addAuthListener(listener: () => void) {
        this.client.getApi().addAuthListener(listener)
    }

    removeAuthListener(listener: () => void) {
        this.client.getApi().removeAuthListener(listener)
    }
}
