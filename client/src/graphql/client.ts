import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";

import config from "../config.json";
import { getAccessToken } from "../utils/auth";

export type Client = ApolloClient<NormalizedCacheObject>;

let client: Client;

const getClient = async (): Promise<Client> => {
  if (client) return client;

  const { ApolloClient, createHttpLink, InMemoryCache } = await import("@apollo/client");
  const { setContext } = await import("@apollo/client/link/context");

  const httpLink = createHttpLink({ uri: config.graphql.url });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: getAccessToken(),
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
