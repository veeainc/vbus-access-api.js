

export interface Credentials {
    access: string
    refresh: string
}

export interface ErrorResponse {
    code: number
    message: string
    errors: any
}

export interface RefreshTokenResp {
    access: string
}

export interface LoginPayload {
    returnUrl: string
}

export interface LoginResp {
    viewUrl: string
}

export interface LoginFinalizePayload {
    state: string
    code: string
}

export interface LoginFinalizeResp {
    access: string
    refresh: string
}

export interface ModuleInfo {
    id: string
    hostname: string
    client: string
}
