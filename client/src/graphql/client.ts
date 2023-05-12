import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { server } from "../config.json";
import { getAccessToken } from "../utils/auth";

export type Client = ApolloClient<NormalizedCacheObject>;

let client: Client;

const getClient = async (url?: string): Promise<Client> => {
  if (client) return client;

  const httpLink = createHttpLink({ uri: url || server.api });
  const authLink = setContext((_, { headers }) => {
    headers: {
      ...headers,
      Authorization: getAccessToken(),
    },
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
