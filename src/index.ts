import Api, {ApiOptions} from "./api";
import {LocalStorage, SessionStorage} from "./storages"


/**
 * Initializes a new Veea api instance.
 * @param options Api options.
 */
export default function createApi(options: ApiOptions): Api {
    return new Api(options)
}


export {
    Api,
    LocalStorage,
    SessionStorage,
}
