import { useState } from "preact/hooks";
import { ApolloQueryResult, DocumentNode, TypedDocumentNode } from "@apollo/client";

import getClient from "../graphql/client";
import { authenticate, fetchCredentials } from "../utils/auth";

const reauth = () => authenticate(fetchCredentials());
let oldError: Error | null = null;
let isRetry = false;

type Q = DocumentNode | TypedDocumentNode;
const useQuery = <T, V = void>(query: Q, vars?: V) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>();
  const [error, setError] = useState<Error | null>();

  console.log(
    `[hooks/usequery.ts] useQuery(query:${
      (query.definitions[0] as any).name.value
    }, vars:${JSON.stringify(vars)})`
  );
  getClient()
    .then(async (client) => {
      let data;
      try {
        data = await client.query({ query, variables: vars });
      } catch (error: any) {
        console.error("[hooks/usequery.ts] useQuery got error:", error);
        console.log(`[hooks/usequery.ts] vars: (${typeof vars}) ${JSON.stringify(vars)}`);
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

        // In case of a 401 we do a retry, but only once. This is because the
        // session could have expired. However, if the user is actually
        // unauthorized to see the contents, we don't want to retry forever.
        if (!isRetry) {
          if (msg.includes("unauthorized") || msg.includes("status code 401")) {
            console.warn("[hooks/usequery.ts] It's a 401, we will attempt to reauth...");
            await reauth();
            console.log("[hooks/usequery.ts] Reauth successful, retrying...");
            setLoading(true);
            isRetry = true;
          }
        }
      }

      if (data) {
        console.log("[hooks/usequery.ts] useQuery got data:", data);
        setData((data as ApolloQueryResult<T>).data);
        setLoading(false);
        if (error) setError(null);
      }
    })
    .catch((error) => {
      console.error(`[hooks/usequery.ts] Error getting graphql client: ${error}`);
    });

  console.log("[hooks/usequery.ts] useQuery.return:", { loading, error, data });
  return { loading, error, data };
};

export default useQuery;
