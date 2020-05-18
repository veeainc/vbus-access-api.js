import React from "react";
import AccessApi from "vbus-access-api/dist/AccessApi";
import {Client} from "vbus-access-api/dist/client"

const VeeaContext = React.createContext<Client>(null);

export default VeeaContext
