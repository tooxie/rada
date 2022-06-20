import { useState } from "preact/hooks";
import { ApolloQueryResult, DocumentNode, TypedDocumentNode } from "@apollo/client";

import getClient from "../graphql/client";
import Logger from "../logger";

const log = new Logger(__filename);

type Q = DocumentNode | TypedDocumentNode;
const useQuery = <T, V = void>(query: Q, vars?: V) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>();
  const [error, setError] = useState<string | null>();

  log.debug(
    `useQuery(query:${(query.definitions[0] as any).name.value}, vars:${JSON.stringify(
      vars
    )})`
  );
  getClient()
    .then(async (client) => {
      let data;
      try {
        data = await client.query({ query, variables: vars });
      } catch (error: any) {
        log.error("useQuery got error:", error);
        log.debug(`vars: (${typeof vars}) ${JSON.stringify(vars)}`);
        setLoading(false);
        setError(normalizeMessage(error.message));
      }

      if (data) {
        log.debug("useQuery got data:", data);
        setData((data as ApolloQueryResult<T>).data);
        setLoading(false);
        if (error) setError(null);
      }
    })
    .catch((error) => {
      log.error(`Error getting graphql client: ${error}`);
    });

  log.debug("useQuery.return:", { loading, error, data });
  return { loading, error, data };
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
