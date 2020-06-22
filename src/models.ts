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
     * New access token.
     */
    access: string
}

/**
 * Login payload.
 */
export interface LoginPayload {
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
     * External view url
     */
    viewUrl: string
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

/**
 * Finalize login response.
 */
export interface LoginFinalizeResp {
    /**
     * Access token
     */
    access: string

    /**
     * Refresh token
     */
    refresh: string

    /**
     * User info
     */
    user: UserInfo
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
