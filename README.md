# vbus-access-api


## Example

Full example available at:

    git clone git@bitbucket.org:boolangery/vbus-access-demo.git

## Usage

```typescript
import createApi, {LocalStorage} from "vbus-access-api";

const api = createApi({
    baseUrl: "http://localhost:8080/api/v1/",
    storage: new LocalStorage(),
    onUnauthenticated: (api) => {
        // example: get login url and redirect user to it.
        // you must setup a page to catch return url and call: api.login.finalize.post
        return api.login.post({
            returnUrl: window.location.href + "login"
        }).then(r => {
            window.location.replace(r.data.viewUrl)
        }).catch(r => {
            console.error(r)
        })
    }
});
```

## API Reference

POST /login     
```typescript
api.login.post({
    returnUrl: "my/return/url"
})
```

POST /login/finalize
```typescript
api.login.finalize.post({
    code: "code",
    state: "state",
})
```

POST /logout     
```typescript
api.logout.post()
```


GET /services

Discover services
```typescript
api.services.get()
```

GET /services/{path}

Read on Vbus
```typescript
// Get Vbus elements (tree)
api.services
    .domain("system")
    .name("usbcam")
    .host("XXXXXX")
    .get()

// synchronous attribute read
api.services
    .domain("system")
    .name("usbcam")
    .host("XXXXXX")
    .path("...")
    .readAttr()
```

POST /service/{path}

Write Vbus
```typescript
// Call a method
api.services
    .domain("system")
    .name("usbcam")
    .host("XXXXXX")
    .path('Connect')
    .post(["arg1", "arg2"])

// or write an attribte
api.services
    .domain("system")
    .name("usbcam")
    .host("XXXXXX")
    .path('Connect')
    .post(42)
```
