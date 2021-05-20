import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import config from "./config";

const httpLink = createHttpLink({ uri: config.ApiUrl });
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-api-key": config.ApiKey
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: "gawshi",
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
});

export default client;
