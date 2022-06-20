import { useState, useEffect } from "preact/hooks";

import Logger from "../logger";

const log = new Logger(__filename);

interface UseReturn<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

const use = <T, V>(fn: Function, vars: V): UseReturn<T> => {
  log.debug(`fn(${JSON.stringify(vars)})`);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fn(vars)
      .then((data: T) => {
        log.debug("use.useEffect.fn data:", data);
        setData((data as any).data);
        setLoading(false);
        if (error) setError(null);
      })
      .catch(async (error: Error) => {
        log.error(error);
        log.error(`fn(${JSON.stringify(vars)}`);
        setLoading(false);
        setError(error.message);
      });
  }, [fn, vars]);

  const result = { loading, error, data };
  log.debug("use.return:", result);
  return result;
};

export default use;
