import { useState } from "preact/hooks";
import { DocumentNode, TypedDocumentNode } from "@apollo/client";

import getClient from "../graphql/client";
import Logger from "../logger";

import use from "./use";

const log = new Logger(__filename);

type V = { [k: string]: string };
type Q = DocumentNode | TypedDocumentNode<any, V>;
type UseReturnType = Omit<ReturnType<typeof use>, "data">;
interface UseGetReturn<T> extends UseReturnType {
  item: T | null;
}

const curry = (fn: Function, query: Q) => fn.bind(null, query);
const exec = async (query: Q, variables: V) =>
  getClient().then((client) =>
    client.query({
      query,
      variables,
    })
  );

const useGet = <T, V>(query: Q, pk: V): UseGetReturn<T> => {
  log.debug(`useGet(pk:${JSON.stringify(pk)})`);
  const key = (query.definitions[0] as any).selectionSet.selections[0].name.value;

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const result = use<T, V>(curry(exec, query), pk);
  if (result.data) setItem((result.data as any)[key] as T);
  setError(result.error);
  setLoading(result.loading);

  log.debug("useGet.return:", { loading, item, error });
  return { loading, item, error };
};

export default useGet;
