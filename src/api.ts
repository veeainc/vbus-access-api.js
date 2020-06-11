import axios, {AxiosInstance, AxiosResponse} from "axios";
import * as models from "./models";
import {ApiStorage} from "./storages";
import {ModuleInfo} from "./models";
import jwt_decode from 'jwt-decode';


type Subscriber = (token: string) => void;

const HEADER_PREFIX = "Bearer ";

/**
 * Define Api options.
 */
export interface ApiOptions {
    baseUrl: string

    storage: ApiStorage

    /**
     * Called when a request fail with an authentication error.
     */
    onUnauthenticated?: (api: Api) => Promise<void>
}

class Api {
    private axios: AxiosInstance;
    private isAlreadyFetchingAccessToken = false;
    // This is the list of waiting requests that will retry after the JWT refresh complete
    private subscribers: Subscriber[] = [];
    private readonly baseUrl: string;
    private options: ApiOptions;
    private storage: ApiStorage;
    private authListeners: (()=>void)[] = []

    constructor(options: ApiOptions) {
        this.baseUrl = options.baseUrl;

        // ensure trailing slash
        if (!this.baseUrl.endsWith("/")) {
            this.baseUrl += "/"
        }

        this.options = options;
        this.storage = options.storage;

        this.axios = axios.create({
            baseURL: this.baseUrl,
        });

        // intercept token expired errors to automatically refresh
        this.axios.interceptors.response.use(
            (response) => {
                // If the request succeeds, we don't have to do anything and just return the response
                return response
            },
            (error) => {
                const errorResponse = error.response;
                if (this.isTokenExpiredError(errorResponse)) {
                    console.log('Token expiré: ', error.response.config.url);
                    return this.resetTokenAndReattemptRequest(error)
                }

                if (this.isNotAuthenticatedError(errorResponse)) {
                    console.log('Invalid token: ', error.response.config.url);
                    return this.resetTokenAndReattemptRequest(error)
                }

                // If the error is due to other reasons, we just throw it back to axios
                return Promise.reject(error)
            }
        );

        // intercept request to add jwt token
        this.axios.interceptors.request.use(async (config) => {
            try {
                const access = await this.storage.readAccessToken();
                if (access && access !== "") {
                    config.headers['Authorization'] = `${HEADER_PREFIX}${access}`
                }
                return config
            } catch (e) {
                // cannot read token
                await this.fireOnUnauthenticated();
                return Promise.reject("not authenticated");
            }
        });
    }

    private async fireOnUnauthenticated() {
        if (this.options.onUnauthenticated) {
            await this.options.onUnauthenticated(this);
        }
    }

    private isTokenExpiredError(errorResponse: AxiosResponse): boolean {
        if (!errorResponse) return false;
        const data = errorResponse.data as models.ErrorResponse;
        return data.code === 1102 // ErrorExpiredAccessToken
    }

    private isNotAuthenticatedError(errorResponse: AxiosResponse): boolean {
        if (!errorResponse) return false;
        const data = errorResponse.data as models.ErrorResponse;
        return data.code === 1100 || data.code === 1101 // ErrorMissingOrInvalidAuthHeader or ErrorInvalidAccessToken
    }

    private async resetTokenAndReattemptRequest(error: any) {
        try {
            const {response: errorResponse} = error;

            let access: string | null = "";
            let refresh: string | null = "";
            try {
                access = await this.storage.readAccessToken();
                refresh = await this.storage.readRefreshToken();
            } catch (e) {
                await this.fireOnUnauthenticated();
                return Promise.reject(error)
            }

            if (!refresh || refresh === "") {
                // no refresh token ?
                await this.fireOnUnauthenticated();
                return Promise.reject(error);
            }
            if (!access || access === "") {
                return Promise.reject(error);
            }

            /* Proceed to the token refresh procedure
            We create a new Promise that will retry the request,
            clone all the request configuration from the failed
            request in the error object. */
            const retryOriginalRequest = new Promise(resolve => {
                /* We need to add the request retry to the queue
                since there another request that already attempt to
                refresh the token */
                this.addSubscriber((access_token: string) => {
                    errorResponse.config.headers.Authorization = HEADER_PREFIX + access_token;
                    resolve(axios(errorResponse.config));
                });
            });
            if (!this.isAlreadyFetchingAccessToken) {
                this.isAlreadyFetchingAccessToken = true;

                // use axios without interceptor
                return axios.post(`${this.baseUrl}login/refresh`, {
                    refresh: refresh,
                    access: access,
                }).then(async (resp: AxiosResponse<models.RefreshTokenResp>) => {
                    const newToken = resp.data.access;
                    await this.storage.storeAccessToken(newToken);
                    this.fireStorageUpdatedEvent();
                    this.isAlreadyFetchingAccessToken = false;
                    this.onAccessTokenFetched(newToken);
                    return retryOriginalRequest;
                }).catch(async (e) => {
                    this.isAlreadyFetchingAccessToken = false;
                    await this.fireOnUnauthenticated();
                    return Promise.reject(error)
                });
            }
            return retryOriginalRequest;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public addAuthListener(listener: () => void) {
        this.authListeners.push(listener);
    }

    public removeAuthListener(listener: () => void) {
        const removeIndex = this.authListeners.findIndex(obs => {
            return listener === obs;
        });

        if (removeIndex !== -1) {
            this.authListeners = this.authListeners.slice(removeIndex, 1);
        }
    }

    /**
     * Fire a notification to inform that local storage has been updated.
     */
    private fireStorageUpdatedEvent() {
        this.authListeners.forEach(l => l());
    }

    private onAccessTokenFetched(access_token: string) {
        // When the refresh is successful, we start retrying the requests one by one and empty the queue
        this.subscribers.forEach(callback => callback(access_token));
        this.subscribers = [];
    }

    private addSubscriber(callback: Subscriber) {
        this.subscribers.push(callback);
    }

    /**
     * Build a get request.
     * @param path
     * @constructor
     */
    private buildGet<T>(path: string): () => Promise<AxiosResponse<T>> {
        return () => {
            return this.axios.get<T>(path)
        }
    }

    /**
     * Build a delete request.
     * @param path
     * @constructor
     */
    private buildDelete(path: string): () => Promise<AxiosResponse> {
        return () => {
            return this.axios.delete(path)
        }
    }

    /**
     * Build a post request.
     * @param path
     * @constructor
     */
    private buildPost<T, R = T>(path: string): (body: T) => Promise<AxiosResponse<R>> {
        return (body: T) => {
            return this.axios.post<R>(path, body)
        }
    }

    private buildPostWithoutBody(path: string): () => Promise<AxiosResponse> {
        return () => {
            return this.axios.post(path)
        }
    }

    /**
     * Build a put request
     * @param path
     * @constructor
     */
    private buildPut<T>(path: string): (body: T) => Promise<AxiosResponse<T>> {
        return (body: T) => {
            return this.axios.put<T>(path, body)
        }
    }

    /**
     * Build a patch request
     * @param path
     * @constructor
     */
    private buildPatch<T>(path: string): (body: T) => Promise<AxiosResponse<T>> {
        return (body: T) => {
            return this.axios.patch<T>(path, body)
        }
    }

    // public api /////////////////////////////////////////////////////////////

    /**
     * Tells if the user is authenticated.
     */
    public async isAuthenticated(): Promise<boolean> {
        const refreshToken = await this.storage.readRefreshToken()

        if (refreshToken) {
            const decoded = jwt_decode(refreshToken) as {exp: number};
            const currentTime = (Date.now().valueOf() / 1000) + 120000; // 120000 is for 2 min offset in ms
            return (decoded.exp > currentTime)
        }
        return false
    }

    public login = {
        post: this.buildPost<models.LoginPayload, models.LoginResp>(`login`),
        finalize: {
            post: async (payload: models.LoginFinalizePayload): Promise<AxiosResponse<models.LoginFinalizeResp>> => {
                const r = await this.buildPost<models.LoginFinalizePayload, models.LoginFinalizeResp>(`login/finalize`)(payload);
                await this.storage.storeAccessToken(r.data.access);
                await this.storage.storeRefreshToken(r.data.refresh);
                this.fireStorageUpdatedEvent()
                return r
            },
        },
    };

    public logout = {
        post: this.buildPost<models.LogoutPayload, models.LogoutResp>(`logout`)
    }

    public services = {
        get: this.buildGet<ModuleInfo[]>(`services`),
        domain: (domain: string) => ({
            name: (name: string) => ({
                get: this.buildGet<object>(`services/${domain}/${name}`),
                host: (host: string) => ({
                    get: this.buildGet<object>(`services/${domain}/${name}/${host}`),
                    path: (path: string) => ({
                        get: this.buildGet<object>(`services/${domain}/${name}/${host}/${path}`),
                        post: this.buildPost<object>(`services/${domain}/${name}/${host}/${path}`),
                        readAttr: this.buildGet<object>(`services/${domain}/${name}/${host}/${path}?action=read`),
                    }),
                })
            })
        }),
        path: (path: string) => ({
            post: this.buildPost<object>(`services/${path}`),
            getRead: this.buildGet<object>(`services/${path}?action=read`),
            get: this.buildGet<object>(`services/${path}`),
        })
    }

    public edges = {
        get: this.buildGet<ModuleInfo[]>(`edges/services`),
        domain: (domain: string) => ({
            name: (name: string) => ({
                get: this.buildGet<object>(`edges/services/${domain}/${name}`),
                host: (host: string) => ({
                    get: this.buildGet<object>(`edges/services/${domain}/${name}/${host}`),
                    path: (path: string) => ({
                        get: this.buildGet<object>(`edges/services/${domain}/${name}/${host}/${path}`),
                        post: this.buildPost<object>(`edges/services/${domain}/${name}/${host}/${path}`),
                        readAttr: this.buildGet<object>(`edges/services/${domain}/${name}/${host}/${path}?action=read`),
                    }),
                })
            })
        })
    }
}

export default Api
