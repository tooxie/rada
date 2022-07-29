import { useState } from "preact/hooks";
import { DocumentNode } from "@apollo/client";

import getClient from "../graphql/client";
import Logger from "../logger";

const log = new Logger(__filename);

type M = DocumentNode;
export interface Executing<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
type R<T> = [Function, Executing<T>];

const useMutation = <D, V = {}>(mutation: M): R<D> => {
  log.debug("useMutation()");
  const [data, setData] = useState<D | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutator = (variables?: V) => {
    setLoading(true);
    getClient().then(async (client) => {
      log.debug(`mutate:${JSON.stringify(variables)}`);
      client
        .mutate({
          mutation,
          variables,
        })
        .then(({ data }) => {
          log.debug(`useMutation.data: ${JSON.stringify(data)}`);
          log.debug(data);
          setLoading(false);
          setData(data);
        })
        .catch((e: Error) => {
          log.debug("useMutation.error");
          log.error(e);
          setError(e.message);
          setLoading(false);
        });
    });
  };

  return [mutator, { loading, error, data }];
};

export default useMutation;
