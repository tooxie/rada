import type { NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { getAccessToken, refreshToken } from "../utils/auth";
import Logger from "../logger";

export type Client = ApolloClient<NormalizedCacheObject>;

const log = new Logger(__filename);

const getClient = (uri: string, name: string, serverId: string): Client => {
  log.debug(`Getting client: name=${name}, uri=${uri}, serverId=${serverId}`);
  const httpLink = createHttpLink({ uri });

  const authLink = setContext(async (_, { headers }) => {
    try {
      const token = getAccessToken();
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
          'X-Server-ID': serverId
        },
      };
    } catch (error) {
      log.debug("Token expired, refreshing...");
      try {
        const newToken = await refreshToken();
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
            'X-Server-ID': serverId
          },
        };
      } catch (refreshError) {
        log.error("Failed to refresh token:", refreshError);
        throw refreshError;
      }
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        log.error(`[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`);
      }
    }

    if (networkError) {
      log.error(`[Network error]: ${networkError}`);
    }

    // If we get a 401, try to refresh the token and retry the operation
    if ((networkError as any)?.statusCode === 401 ||
        (graphQLErrors && graphQLErrors.some(err => err.extensions?.code === 'UNAUTHENTICATED'))) {
      log.debug("Received 401, attempting token refresh...");
      // Clear the token to force a refresh in the auth link
      sessionStorage.removeItem("awsAccessToken");
      return forward(operation);
    }

    return forward(operation);
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Album: {
        fields: {
          artists: {
            merge(existing, incoming) {
              // Little hack to sort the artists by their id. This is necessary
              // because the artists are not sorted by the server, which causes
              // the app to fall into an infinite render loop. Don't ask me why
              // exactly, I'm not a frontend developer :D
              if (!incoming) return existing;
              return [...incoming].sort((a, b) => a.__ref.localeCompare(b.__ref));
            }
          }
        }
      }
    }
  });

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache,
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
