import AccessApi, {ApiOptions} from "./AccessApi";
import {ApiStorage, LocalStorage, SessionStorage} from "./storages"
import {
    ModuleInfo,
    LoginFinalizeResp,
    LoginFinalizePayload,
    LoginResp,
    LoginPayload,
    Credentials,
    ErrorResponse,
    RefreshTokenResp
} from "./models"


/**
 * Initializes a new Veea api instance.
 * @param options Api options.
 */
export default function createApi(options: ApiOptions): AccessApi {
    return new AccessApi(options)
}


export {
    AccessApi,
    ApiOptions,
    //
    ApiStorage,
    LocalStorage,
    SessionStorage,
    //
    ModuleInfo,
    LoginFinalizeResp,
    LoginFinalizePayload,
    LoginResp,
    LoginPayload,
    Credentials,
    ErrorResponse,
    RefreshTokenResp,
}