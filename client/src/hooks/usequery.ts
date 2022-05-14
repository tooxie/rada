import { useState } from "preact/hooks";
import { ApolloQueryResult, DocumentNode, TypedDocumentNode } from "@apollo/client";

import getClient from "../graphql/client";
import Logger from "../logger";

const log = new Logger(__filename);
let oldError: Error | null = null;

type Q = DocumentNode | TypedDocumentNode;
const useQuery = <T, V = void>(query: Q, vars?: V) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>();
  const [error, setError] = useState<Error | null>();

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
        const msg = error.message.toLowerCase();

        // If we always set the error we end up in an infinite loop because
        // each error is a different object in memory, which triggers a new
        // render and a new query to graphql.
        if (msg === oldError?.message.toLowerCase()) {
          setError(oldError);
        } else {
          setError(error);
          oldError = error;
        }
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

export default useQuery;
