import { useState } from "preact/hooks";
import {
  ApolloQueryResult,
  DocumentNode,
  TypedDocumentNode,
  ApolloClient,
  NormalizedCacheObject
} from "@apollo/client";

type C = ApolloClient<NormalizedCacheObject>;
type Q = DocumentNode | TypedDocumentNode;
export default <T, V>(client: C, query: Q, variables: V) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  console.log("useQuery");
  client
    .query({
      query,
      variables
    })
    .then(data => {
      console.log(`useQuery got data:`);
      console.log(data);
      setData((data as ApolloQueryResult<T>).data);
      setLoading(false);
    })
    .catch(error => {
      console.log(`useQuery got error: ${error}`);
      setError(error);
      setLoading(false);
    });

  console.log("useQuery.return:");
  console.log({ loading, error, data });
  return { loading, error, data };
};
