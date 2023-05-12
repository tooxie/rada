import { useState, useEffect } from "preact/hooks";

import type { Client } from "../graphql/client";
import getClient from "./utils/client";
import Logger from "../logger";
import { ServerId } from "../types";

const log = new Logger(__filename);

interface UseReturn<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
type ErrorNormalizer = (s: string) => string;

const use = <T>(
  fn: (c: Client) => Promise<any>,
  serverId: ServerId,
  enFn?: ErrorNormalizer
): UseReturn<T> => {
  log.debug(`use(server:${serverId})`);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const normalizer = enFn ? enFn : (s: string) => s;

  useEffect(() => {
    getClient(serverId)
      .then((client) =>
        fn(client)
          .then((data: T) => {
            log.debug("use.useEffect.fn data:", data);
            setData((data as any).data);
            setLoading(false);
            if (error) setError(null);
          })
          .catch(async (error: Error) => {
            log.error(error);
            setLoading(false);
            setError(normalizer(error.message));
          })
      )
      .catch((error) => {
        log.error(`Error getting graphql client: ${error}`);
        if (typeof error === "string") setError(error);
        else setError(error.toString());
      });
  }, [fn]);

  const result = { loading, error, data };
  log.debug("use.return:", result);
  return result;
};

export default use;
