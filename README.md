# vbus-access

This is the in-browser Vbus library. It allows to display Vbus element in the frontend.

## Usage

First step is to create a client object:

```typescript
import {LocalStorage, Client} from "@veea/vbus-access";

const client = new Client({
    baseUrl: "http://localhost:8080/api/v1/",
    storage: new LocalStorage(),
    onUnauthenticated: (client) => {
        const returnUrl = window.location.href;
        return client.getLoginView(returnUrl).then(r => {
            window.location.replace(r.viewUrl)
        }).catch(r => {
            console.error(r)
        })
    }
});
```

## API Reference

### Login

To login, you need to redirect the user to the login screen (external service):

```typescript
client.getLoginView("https://return/url").then(r => {
    window.location.href = r.viewUrl
})
```

Then catch the `state` and the `code` query param appended on the returnUrl and call:

```typescript
await client.finalizeLogin("state", "code")
```

### Logout

To logout, you need to redirect the user to the logout screen (external service):

```typescript

client.getLogoutView("https://return/url").then(r => {
    window.location.href = r.viewUrl
})
```

### Retrieving vbus elements

The API is the same as the Python or the Golang library.

You can only read elements, you cannot create Vbus elements.

#### Discover running Vbus modules

```typescript
import {ModuleInfo} from "@veea/vbus-access";

const modules: ModuleInfo[] = await client.discoverModules(1)
```

#### Discover Vbus element on a specific service

```typescript
import {UnknownProxy} from "@veea/vbus-access";

const element: UnknownProxy = await client.discover("system.info")
```

#### Get remote elements

Attribute:
```typescript
import {AttributeProxy} from "@veea/vbus-access";

const attr: AttributeProxy = await client.getRemoteAttr("system", "info", "host", "hour")
const value = await attr.readValue()
```

Method:
```typescript
import {MethodProxy} from "@veea/vbus-access";

const method: MethodProxy = await client.getRemoteMethod("system", "info", "host", "setHour")
await method.call(42)

```
