import { useState, useEffect, useMemo } from "preact/hooks";
import {
  DocumentNode,
  QueryOptions,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";

import type { Client } from "../graphql/client";
import Logger from "../logger";
import { ServerId } from "../types";

import use from "./use";
import { getDocumentNodeName } from "./utils/name";

const log = new Logger(__filename);

type V = { [k: string]: string };
type Q = DocumentNode | TypedDocumentNode<any, V>;
type UseReturnType = Omit<ReturnType<typeof use>, "data">;
interface UseGetReturn<T> extends UseReturnType {
  item: T | null;
}

const useGet = <T, V extends OperationVariables>(
  query: Q,
  serverId: ServerId,
  pk: V
): UseGetReturn<T> => {
  const qName = getDocumentNodeName(query);
  const key = (query.definitions[0] as any).selectionSet.selections[0].name.value;

  log.debug(`[${qName}] useGet(pk:${JSON.stringify(pk)})`);

  const exec = (client: Client) => {
    const options: QueryOptions = { query, variables: pk };
    return client.query(options);
  };

  const result = use<T>(qName, exec, serverId);

  const item = useMemo(() => {
    if (!result.data) return null;
    return (result.data as any)[key] as T;
  }, [result.data, key]);

  return useMemo(() => {
    const returnValue = { loading: result.loading, error: result.error, item };
    log.debug(`[${qName}] useGet.return:`, returnValue);
    return returnValue;
  }, [result.loading, result.error, item, qName]);
};

export default useGet;
