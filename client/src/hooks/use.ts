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
  name: string,
  fn: (c: Client) => Promise<any>,
  serverId?: ServerId,
  enFn?: ErrorNormalizer
): UseReturn<T> => {
  log.debug(`[${name}] use(serverId="${serverId}")`);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const normalizer = enFn ? enFn : (s: string) => s;

  useEffect(() => {
    getClient(serverId)
      .then((client: Client) =>
        fn(client)
          .then((result: T) => {
            log.debug(`[${name}] use.useEffect.fn data:`, result);
            setData((result as any).data);
            setLoading(false);
            if (error) setError(null);
          })
          .catch((error: Error) => {
            log.error(`[${name}] Error fetching data: ${error}`);
            setLoading(false);
            const msg = typeof error === "string" ? error : error.message;
            setError(normalizer(msg));
          })
      )
      .catch((error: Error | string) => {
        log.error(`[${name}] Error getting graphql client: ${error}`);
        setError(typeof error === "string" ? error : error.message);
        setLoading(false);
        setData(null);
      });
  }, [name, fn, serverId]);

  const result = { loading, error, data };
  log.debug(`[${name}] use.return:`, result);
  return result;
};

export default use;
