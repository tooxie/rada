import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { getAccessToken } from "../utils/auth";
import Logger from "../logger";

export type Client = ApolloClient<NormalizedCacheObject>;

const log = new Logger(__filename);
const getClient = (uri: string, name: string): Client => {
  log.debug(`getClient(uri:${uri}, name:${name}`);
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
