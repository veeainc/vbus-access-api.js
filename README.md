# vbus-access

This is the in-browser Vbus library. It allows to display Vbus element in the frontend.

The API is the same as the Golang and the Python library except you can't create Vbus elements.

This is a bridge using Vbus access Rest API.

To build the jsdoc:

    $ npm i && npm run doc

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
