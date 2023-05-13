import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { getAccessToken } from "../utils/auth";

export type Client = ApolloClient<NormalizedCacheObject>;

const getClient = async (uri: string, name: string): Promise<Client> => {
  const httpLink = createHttpLink({ uri });
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: getAccessToken(),
    },
  }));

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    name,
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
