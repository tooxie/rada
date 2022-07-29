import { useState } from "preact/hooks";
import {
  ApolloQueryResult,
  DocumentNode,
  TypedDocumentNode,
  // useQuery as apolloUseQuery,
  QueryOptions,
} from "@apollo/client";

import getClient from "../graphql/client";
import Logger from "../logger";

const log = new Logger(__filename);

type Q = DocumentNode | TypedDocumentNode;
const useQuery = <T, V = void>(query: Q, variables?: V) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>();
  const [error, setError] = useState<string | null>();
  const [refetching, setRefetching] = useState(false);

  const refetch = () => {
    setError(null);
    setData(null);
    setLoading(true);
    setRefetching(true);
  };

  log.debug(
    `useQuery(query:${
      (query.definitions[0] as any).name.value
    }, variables:${JSON.stringify(variables)})`
  );
  getClient()
    .then(async (client) => {
      let options: QueryOptions = { query, variables };
      if (refetching) {
        options["fetchPolicy"] = "network-only";
      }
      let data;
      try {
        data = await client.query(options);
      } catch (error: any) {
        log.error(error);
        log.debug(`variables: (${typeof variables}) ${JSON.stringify(variables)}`);
        setLoading(false);
        setError(normalizeMessage(error.message));
      }

      if (data) {
        log.debug("useQuery got data:", data);
        setData((data as ApolloQueryResult<T>).data);
        setLoading(false);
        if (error) setError(null);
        setRefetching(false);
      }
    })
    .catch((error) => {
      log.error(`Error getting graphql client: ${error}`);
    });

  log.debug("useQuery.return:", { loading, error, data });
  return { loading, error, data, refetch };
};

// DynamoDB adds a random request ID with every error message which breaks
// our check to prevent infinite loops, that's why we have to do this hack.
const normalizeMessage = (message: string): string => {
  const i = message.indexOf(", Request ID");
  if (i > -1) {
    return message.substring(0, i);
  }

  return message;
};

export default useQuery;
