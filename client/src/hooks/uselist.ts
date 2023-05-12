import { useState } from "preact/hooks";
import { DocumentNode, TypedDocumentNode, QueryOptions } from "@apollo/client";

import type { Client } from "../graphql/client";
import type { ServerId } from "../types";
import Logger from "../logger";

import use from "./use";

type Query = DocumentNode | TypedDocumentNode;
type UseReturnType = Omit<ReturnType<typeof use>, "data">;
interface UseListReturn<T> extends UseReturnType {
  items: T[];
  refetch: () => void;
}

const log = new Logger(__filename);

const useList = <Q, T, V = void>(
  query: Query,
  serverId: ServerId,
  variables?: V
): UseListReturn<T> => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refetching, setRefetching] = useState(false);
  const qName: string = (query.definitions[0] as any).name.value;

  const exec = async (client: Client) => {
    const options: QueryOptions = { query, variables };

    log.debug(`uselist.${qName}(refetching==${refetching})`);

    let queryFn = client.query(options);
    if (refetching) {
      options["fetchPolicy"] = "network-only";
      queryFn = client.query(options);
      queryFn.then((data) => {
        setRefetching(false);
        return data;
      });
    }

    return queryFn;
  };

  const refetch = () => {
    log.debug("Refetching...");
    setError(null);
    setItems([]);
    setLoading(true);
    setRefetching(true);
  };

  log.debug(`useList(query:${qName}, variables:${JSON.stringify(variables)})`);

  const result = use<Q>(exec, serverId, normalizeMessage);
  if (result.data) {
    const key = Object.keys(result.data).find((key) => key.startsWith("list"));
    if (key) setItems(((result.data as any)[key].items || []) as T[]);
  }
  setLoading(result.loading);
  setError(result.error);

  log.debug("useList.return:", { loading, error, items });
  return { loading, error, items, refetch };
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

export default useList;
