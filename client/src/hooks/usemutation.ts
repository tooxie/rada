import { useState } from "preact/hooks";
import type { DocumentNode, OperationVariables } from "@apollo/client";

import Logger from "../logger";

import getClient from "./utils/client";

const log = new Logger(__filename);

type Mutation = DocumentNode;
export interface Executing<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
type MutationFunction<V> = (variables?: V) => void;
type R<T, V> = [MutationFunction<V>, Executing<T>];

const useMutation = <T, V extends OperationVariables = Record<string, never>>(mutation: Mutation): R<T, V> => {
  log.debug("useMutation()");
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutator = (variables?: V) => {
    setLoading(true);
    getClient().then((client) => {
      log.debug("useMutation.variables", variables);
      client
        .mutate<T, V>({
          mutation,
          variables,
        })
        .then(({ data }) => {
          log.debug("useMutation.data", data);
          log.debug(data);
          setLoading(false);
          setData(data ?? null);
        })
        .catch((e: Error) => {
          log.error("useMutation.error", e);
          setError(e.message);
          setLoading(false);
          setData(null);
        });
    });
  };

  return [mutator, { loading, error, data }];
};

export default useMutation;
