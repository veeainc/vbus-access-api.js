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

export interface LogoutPayload {
    returnUrl: string
}

export interface LogoutResp {
    viewUrl: string
}

export interface LoginFinalizePayload {
    state: string
    code: string
}

export interface UserInfo {
    id: string
    userName: string
    firstName: string
    lastName: string
    identifier: string
    individualId: string
    deviceContext: string
    email: string
    canChangePassword: boolean
}

export interface LoginFinalizeResp {
    access: string
    refresh: string
    user: UserInfo
}

export interface ModuleInfo {
    id: string
    hostname: string
    client: string
}
