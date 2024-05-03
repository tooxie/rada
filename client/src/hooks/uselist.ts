import { useState } from "preact/hooks";
import type { DocumentNode, TypedDocumentNode, QueryOptions } from "@apollo/client";

import type { Client } from "../graphql/client";
import type { ServerId } from "../types";
import Logger from "../logger";

import use from "./use";
import { getDocumentNodeName } from "./utils/name";

type Query = DocumentNode | TypedDocumentNode;
type UseReturnType = Omit<ReturnType<typeof use>, "data">;
interface UseListReturn<R> extends UseReturnType {
  items: R[];
  refetch: () => void;
}

const log = new Logger(__filename);

const useList = <Q, R, V = void>(
  query: Query,
  serverId: ServerId,
  variables?: V
): UseListReturn<R> => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<R[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refetching, setRefetching] = useState(false);
  const qName = getDocumentNodeName(query);

  const exec = (client: Client) => {
    const options: QueryOptions = { query, variables };

    log.debug(`[${qName}] uselist.${qName}(refetching: ${refetching})`);

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
    log.debug(`[${qName}] Refetching...`);
    setError(null);
    setItems([]);
    setLoading(true);
    setRefetching(true);
  };

  log.debug(`[${qName}] useList(query:${qName}, variables:${JSON.stringify(variables)})`);

  const result = use<Q>(qName, exec, serverId, normalizeMessage);
  if (result.data) {
    const key = Object.keys(result.data).find((key) => key.startsWith("list"));
    if (key) setItems(((result.data as any)[key].items || []) as R[]);
  }
  setLoading(result.loading);
  setError(result.error);

  log.debug(`[${qName}] useList.return:`, { loading, error, items });
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
