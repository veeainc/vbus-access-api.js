# vbus-access

This is the in-browser Vbus library. It allows to display Vbus element in the frontend.

The API is the same as the Golang and the Python library except you can't create Vbus elements.

This is a bridge using Vbus access Rest API.

To build the jsdoc:

    $ npm i && npm run doc

## Usage

First step is to create a client object:

```typescript
import {Client, InitResponse} from "@veea/vbus-access";

const client = new Client({baseUrl: "http://localhost:8080/api/v1/"});

// And then you must ensure that `client.init()` is called once:
client.init().then((r: InitResponse) => {
    console.log(r.authenticated) // true if authenticated
    
    // information is filled if user is authenticated
    if (r.authenticated) {
        console.log(r.information.claims.email)
        console.log(r.information.claims.family_name)
        console.log(r.information.claims.name)
    }
}).catch(r => {
    console.log(r)
})
```

# login

One line login:

```typescript
client.login().then(() => {
    console.log("login done")
}).catch(r => {
    console.log(r)
})
```

It will handle everything for you.
