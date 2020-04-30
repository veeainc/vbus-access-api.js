import AccessApi, {ApiOptions} from "./AccessApi";
import {LocalStorage, SessionStorage} from "./storages"


/**
 * Initializes a new Veea api instance.
 * @param options Api options.
 */
export default function createApi(options: ApiOptions): AccessApi {
    return new AccessApi(options)
}


export {
    AccessApi,
    LocalStorage,
    SessionStorage,
}
