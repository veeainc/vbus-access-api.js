/**
 * Manage storage.
 */

export interface ApiStorage {
    readAccessToken(): Promise<string|null>

    readRefreshToken(): Promise<string|null>

    storeAccessToken(token: string): Promise<void>

    storeRefreshToken(token: string): Promise<void>
}
