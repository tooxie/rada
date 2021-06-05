import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import config from "./config";

const read = (b64: string): string =>
  atob ? atob(b64) : Buffer.from(b64).toString("base64");

const httpLink = createHttpLink({ uri: read(config.ApiUrl) });
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-api-key": read(config.ApiKey),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: "Gawshi",
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default client;
