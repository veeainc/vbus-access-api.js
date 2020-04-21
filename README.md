# vbus-access-api

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

## Example with a minimal React app

App.js
```typescript
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import createApi, {LocalStorage} from "vbus-access-api";
import VeeaContext from "./VeeaContext"


class App extends React.Component {
    state = {
        time: ""
    };

    render() {
        const api = createApi({
            baseUrl: "http://localhost:8080/api/v1/",
            storage: new LocalStorage(),
            onUnauthenticated: (api) => {
                console.log('onUnauthenticated');
                return api.login.post({
                    returnUrl: window.location.href + "login"
                }).then(r => {
                    window.location.replace(r.data.viewUrl)
                }).catch(r => {
                    console.error(r)
                })
            }
        });

        return (
            <div className="App">
                <Router>
                    <VeeaContext.Provider value={api}>
                        <Switch>
                            <Route path="/" exact>
                                <Home/>
                            </Route>
                            <Route path="/login" exact>
                                <Login/>
                            </Route>
                        </Switch>
                    </VeeaContext.Provider>
                </Router>
            </div>
        );
    }
}

export default App;

```


The login page: Login.ts

```typescript
import React from "react";
import {withRouter, RouteComponentProps} from "react-router-dom";
import queryString from 'query-string'
import VeeaContext from "../VeeaContext";
import {AccessApi} from "vbus-access-api";

interface Props extends RouteComponentProps {
}

class Login extends React.Component<Props> {
    static contextType = VeeaContext;

    componentDidMount() {
        const api: AccessApi = this.context;
        const values = queryString.parse(this.props.location.search);

        api.login.finalize.post({
            code: values.code as string,
            state: values.state as string,
        }).then(r => {
            console.log("login done")
            this.props.history.push("/")
        }).catch(r => {
            console.error(r.response)
        });
    }

    render() {
        return (
            <header className="App-header">
                Login page
            </header>
        );
    }
}

export default withRouter(Login)
```

The home page: Home.ts
```typescript
import React from "react";
import {withRouter, RouteComponentProps} from "react-router-dom";
import queryString from 'query-string'
import VeeaContext from "../VeeaContext";
import {AccessApi} from "vbus-access-api";

interface Props extends RouteComponentProps {
}

class Login extends React.Component<Props> {
    static contextType = VeeaContext;

    componentDidMount() {
        const api: AccessApi = this.context;
        const values = queryString.parse(this.props.location.search);

        api.login.finalize.post({
            code: values.code as string,
            state: values.state as string,
        }).then(r => {
            this.props.history.push("/")
        }).catch(r => {
            console.error(r.response)
        });
    }

    render() {
        return (
            <header className="App-header">
                Login page
            </header>
        );
    }
}

export default withRouter(Login)
```
