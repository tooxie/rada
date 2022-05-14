import { useState, useEffect } from "preact/hooks";

import Logger from "../logger";

const log = new Logger(__filename);
let oldError: Error | null = null;

interface UseReturn<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

const use = <T, V>(fn: Function, vars: V): UseReturn<T> => {
  const fnName = fn.toString().split("\n")[0].split(" ")[1];
  log.debug(`use("${fnName}", ${JSON.stringify(vars)})`);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fn(vars)
      .then((data: T) => {
        log.debug("use.useEffect.fn data:", data);
        setData(data);
        setLoading(false);
        if (error) setError(null);
      })
      .catch(async (error: Error) => {
        log.error("use.useEffect.fn error:", error);
        log.debug(`vars: (${typeof vars}) ${JSON.stringify(vars)}`);
        log.debug(fn.toString().split("{")[0]);
        setLoading(false);
        const msg = error.message.toLowerCase();

        // If we always set the error we end up in an infinite loop because
        // each error is a different object in memory, which triggers a new
        // render and a new query to graphql.
        if (msg === oldError?.message.toLowerCase()) {
          setError(oldError);
        } else {
          setError(error);
          oldError = error;
        }
      });
  }, [vars]);

  const result = { loading, error, data };
  log.debug("use.return:", result);
  return result;
};

export default use;
