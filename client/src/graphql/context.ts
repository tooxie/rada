import { createContext } from "preact";

import { Client } from "./client";

const ApolloContext = createContext<Client | undefined>(undefined);

export default ApolloContext;
