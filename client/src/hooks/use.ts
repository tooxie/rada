import { useState, useEffect, useCallback, useMemo } from "preact/hooks";

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
  serverId: ServerId,
  enFn?: ErrorNormalizer
): UseReturn<T> => {
  log.debug(`[${name}] use(serverId="${serverId}")`);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const normalizer = useCallback(enFn ? enFn : (s: string) => s, [enFn]);

  const executeQuery = useCallback(async (client: Client) => {
    try {
      const result = await fn(client);
      log.debug(`[${name}] use.useEffect.fn data:`, result);
      setData((result as any).data);
      setError(null);
      setLoading(false);
    } catch (error: any) {
      log.error(`[${name}] Error fetching data: ${error}`);
      setLoading(false);
      const msg = typeof error === "string" ? error : error.message;
      setError(normalizer(msg));
    }
  }, [fn, name, normalizer]);

  useEffect(() => {
    getClient(serverId)
      .then(executeQuery)
      .catch((error: Error | string) => {
        log.error(`[${name}] Error getting graphql client: ${error}`);
        setError(typeof error === "string" ? error : error.message);
        setLoading(false);
        setData(null);
      });
  }, [name, serverId, executeQuery]);

  return useMemo(() => {
    const result = { loading, error, data };
    log.debug(`[${name}] use.return:`, result);
    return result;
  }, [loading, error, data, name]);
};

export default use;
