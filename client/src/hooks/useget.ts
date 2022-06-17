import { useState } from "preact/hooks";
import { DocumentNode, TypedDocumentNode } from "@apollo/client";

import type { Client } from "../graphql/client";
import type { ServerId } from "../types";
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

const getGraphqlClient = (serverId: ServerId): Promise<Client> => getClient();
const curry = (fn: Function, params: [ServerId, Q]) => fn.bind(null, ...params);
const exec = async (serverId: ServerId, query: Q, variables: V) => {
  log.debug(`exec(serverId:${serverId}, vars:${JSON.stringify(variables)})`);
  return getGraphqlClient(serverId).then((client) =>
    client.query({
      query,
      variables,
    })
  );
};

const useGet = <T, V>(sId: ServerId, query: Q, pk: V): UseGetReturn<T> => {
  log.debug(`useGet(serverId:${sId}, pk:${JSON.stringify(pk)})`);
  const key = (query.definitions[0] as any).selectionSet.selections[0].name.value;

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const result = use<T, V>(curry(exec, [sId, query]), pk);
  if (result.data) setItem((result.data as any)[key] as T);
  setError(result.error);
  setLoading(result.loading);

  log.debug("useGet.return:", { loading, item, error });
  return { loading, item, error };
};

export default useGet;
