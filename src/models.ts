/**
 * Standard error response.
 */
export interface ErrorResponse {
    /**
     * Error code
     */
    code: number

    /**
     * Error message
     */
    message: string

    /**
     * Details
     */
    errors: any
}

/**
 * Token refresh response.
 */
export interface RefreshTokenResp {
    /**
     *
     */
    oauth2Token: Oauth2Token
}

/**
 * Login payload.
 */
export interface LoginPayload {
    /**
     * Must be window.origin value
     */
    origin: string
    /**
     * Callback url
     */
    returnUrl: string
}

/**
 * Login response.
 */
export interface LoginResp {
    /**
     * Tells if user is already authenticated.
     */
    authenticated: boolean

    /**
     *  If not authenticated, this is the url to redirect the user.
     */
    redirect: string
}

/**
 * Logout payload.
 */
export interface LogoutPayload {
    /**
     * Callback url
     */
    returnUrl: string
}

/**
 * Logout response.
 */
export interface LogoutResp {
    /**
     * External view url.
     */
    viewUrl: string
}

/**
 * Login finalize payload.
 */
export interface LoginFinalizePayload {
    /**
     * Must be window.origin value
     */
    origin: string

    /**
     * Auth state
     */
    state: string

    /**
     * Auth code
     */
    code: string
}

/**
 * User info.
 */
export interface UserInfo {
    /**
     * Veea user id
     */
    id: string

    /**
     * Username
     */

    userName: string
    /**
     * First name
     */
    firstName: string

    /**
     * Last name
     */
    lastName: string

    /**
     *
     */
    identifier: string

    /**
     *
     */
    individualId: string

    /**
     *
     */
    deviceContext: string

    /**
     * User email address
     */
    email: string

    /**
     *
     */
    canChangePassword: boolean
}

export interface Oauth2Token {
    /**
     *
     */
    access_token: string
    /**
     *
     */
    token_type: string
    /**
     *
     */
    refresh_token: string
    /**
     *
     */
    expiry: string
}


/**
 * Finalize login response.
 */
export interface LoginFinalizeResp {
    returnUrl: string

    /**
     *
     */
    oauth2Token: Oauth2Token

    /**
     *
     */
    claims: {
        /**
         *
         */
        exp: number
        /**
         *
         */
        iat: number
        /**
         *
         */
        auth_time: number
        /**
         *
         */
        jti: string
        /**
         *
         */
        iss: string
        /**
         *
         */
        aud: string
        /**
         *
         */
        sub: string
        /**
         *
         */
        typ: string
        /**
         *
         */
        azp: string
        /**
         *
         */
        session_state: string
        /**
         *
         */
        acr: string
        /**
         *
         */
        email_verified: boolean,
        /**
         *
         */
        name: string
        /**
         *
         */
        preferred_username: string
        /**
         *
         */
        given_name: string
        /**
         *
         */
        family_name: string
        /**
         *
         */
        email: string
    }
}

/**
 * Contains module status info
 */
export interface ModuleStatus {
    /**
     * Heap size
     */
    heapSize: number
}

/**
 * Module info.
 */
export interface ModuleInfo {
    /**
     * Module id name
     */
    id: string

    /**
     * Module hostname
     */
    hostname: string

    /**
     * Module client type
     */
    client: string

    /**
     * Whether or not this module has static files to display.
     */
    hasStaticFiles: boolean

    /**
     * Status
     */
    status: ModuleStatus
}
