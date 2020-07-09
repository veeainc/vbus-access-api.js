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

    /**
     * Store js object.
     */
    storeObject(key: string, obj: object): Promise<void>

    /**
     * Read js object.
     */
    readObject(key: string): Promise<object | null>

    /**
     * Remove an item.
     */
    removeItem(key: string): Promise<void>
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

    storeObject(key: string, obj: object): Promise<void> {
        localStorage.setItem(key, JSON.stringify(obj));
        return Promise.resolve();
    }

    readObject(key: string): Promise<object | null> {
        return Promise.resolve(JSON.parse(localStorage.getItem(key)))
    }

    removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
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

    storeObject(key: string, obj: object): Promise<void> {
        sessionStorage.setItem(key, JSON.stringify(obj));
        return Promise.resolve();
    }

    readObject(key: string): Promise<object | null> {
        return Promise.resolve(JSON.parse(sessionStorage.getItem(key)))
    }

    removeItem(key: string): Promise<void> {
        sessionStorage.removeItem(key);
        return Promise.resolve();
    }
}
