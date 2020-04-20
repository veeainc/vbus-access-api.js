# vbus-access-api

## Usage

```typescript
import AccessApi, {Listener, ApiStorage} from "vbus-access-api"

class LocalStorage implements ApiStorage {
    readAccessToken(): Promise<string | null> {
        console.log("readAccessToken")
        return Promise.resolve(localStorage.getItem('access'))
    }

    readRefreshToken(): Promise<string | null> {
        console.log("readRefreshToken")
        return Promise.resolve(localStorage.getItem('refresh'))
    }

    storeAccessToken(token: string): Promise<void> {
        console.log("storeAccessToken")
        localStorage.setItem('access', token);
        return Promise.resolve();
    }

    storeRefreshToken(token: string): Promise<void> {
        console.log("storeRefreshToken")
        localStorage.setItem('refresh', token);
        return Promise.resolve();
    }
}

class GlobalListener implements Listener {
    onUnauthenticated(): Promise<void> {
        console.log("onUnauthenticated")
        return Promise.resolve();
    }
}

const api = new AccessApi("http://localhost:8080/api/v1/", new LocalStorage(), new GlobalListener());

export default api
```

