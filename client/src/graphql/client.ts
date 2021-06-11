import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import config from "./config";

const read = (b64: string): string =>
  typeof atob === "undefined" ? Buffer.from(b64, "base64").toString("ascii") : atob(b64);
let client: ApolloClient<NormalizedCacheObject>;

const getClient = async () => {
  if (client) return client;

  const { ApolloClient, createHttpLink, InMemoryCache } = await import("@apollo/client");
  const { setContext } = await import("@apollo/client/link/context");

  const httpLink = createHttpLink({ uri: read(config.ApiUrl) });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-api-key": read(config.ApiKey),
      },
    };
  });

  client = new ApolloClient({
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

  return client;
};

export default getClient;
