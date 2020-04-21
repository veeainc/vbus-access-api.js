/**
 * Manage storage.
 */

/**
 * Used to define how token are stored.
 */
export interface ApiStorage {
    /**
     * Read the access token.
     */
    readAccessToken(): Promise<string|null>

    /**
     * Read the refresh token.
     */
    readRefreshToken(): Promise<string|null>

    /**
     * Store the access token.
     */
    storeAccessToken(token: string): Promise<void>

    /**
     * Store the access token.
     */
    storeRefreshToken(token: string): Promise<void>
}

/**
 * Local storage.
 */
export class LocalStorage implements ApiStorage {
    readAccessToken(): Promise<string | null> {
        return Promise.resolve(localStorage.getItem('access'))
    }

    readRefreshToken(): Promise<string | null> {
        return Promise.resolve(localStorage.getItem('refresh'))
    }

    storeAccessToken(token: string): Promise<void> {
        localStorage.setItem('access', token);
        return Promise.resolve();
    }

    storeRefreshToken(token: string): Promise<void> {
        localStorage.setItem('refresh', token);
        return Promise.resolve();
    }
}

/**
 * Session storage.
 */
export class SessionStorage implements ApiStorage {
    readAccessToken(): Promise<string | null> {
        return Promise.resolve(sessionStorage.getItem('access'))
    }

    readRefreshToken(): Promise<string | null> {
        return Promise.resolve(sessionStorage.getItem('refresh'))
    }

    storeAccessToken(token: string): Promise<void> {
        sessionStorage.setItem('access', token);
        return Promise.resolve();
    }

    storeRefreshToken(token: string): Promise<void> {
        sessionStorage.setItem('refresh', token);
        return Promise.resolve();
    }
}
