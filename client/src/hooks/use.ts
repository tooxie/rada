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
  serverId?: ServerId,
  enFn?: ErrorNormalizer
): UseReturn<T> => {
  log.debug(`use(server:${serverId})`);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const normalizer = enFn ? enFn : (s: string) => s;

  useEffect(() => {
    getClient(serverId)
      .then((client: Client) =>
        fn(client)
          .then((data: T) => {
            log.debug("use.useEffect.fn data:", data);
            setData((data as any).data);
            setLoading(false);
            if (error) setError(null);
          })
          .catch((error: Error) => {
            log.error(error);
            setLoading(false);
            const msg = typeof error === "string" ? error : error.message;
            setError(normalizer(msg));
          })
      )
      .catch((error: Error | string) => {
        log.error(`Error getting graphql client: ${error}`);
        setError(typeof error === "string" ? error : error.message);
      });
  }, [fn]);

  const result = { loading, error, data };
  log.debug("use.return:", result);
  return result;
};

export default use;
