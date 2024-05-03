import { useState } from "preact/hooks";
import type { DocumentNode } from "@apollo/client";

import Logger from "../logger";

import getClient from "./utils/client";

const log = new Logger(__filename);

type Mutation = DocumentNode;
export interface Executing<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
type R<T> = [Function, Executing<T>];

const useMutation = <T, V = {}>(mutation: Mutation): R<T> => {
  log.debug("useMutation()");
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutator = (variables?: V) => {
    setLoading(true);
    getClient().then((client) => {
      log.debug("useMutation.variables", variables);
      client
        .mutate({
          mutation,
          variables,
        })
        .then(({ data }) => {
          log.debug("useMutation.data", data);
          log.debug(data);
          setLoading(false);
          setData(data);
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
