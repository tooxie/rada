import { useState, useEffect } from "preact/hooks";

import { authenticate, fetchCredentials } from "../utils/auth";
import Logger from "../logger";

const log = new Logger(__filename);

const reauth = () => authenticate(fetchCredentials());
let oldError: Error | null = null;
let isRetry = false;

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
        isRetry = false;
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

        // In case of a 401 we do a retry, but only once. This is because the
        // session could have expired. However, if the user is actually
        // unauthorized to see the contents, we don't want to retry forever.
        if (!isRetry) {
          if (msg.includes("unauthorized") || msg.includes("status code 401")) {
            log.warn("It's a 401, we will attempt to reauth...");
            await reauth();
            log.debug("Reauth successful, retrying...");
            setLoading(true);
            isRetry = true;
          }
        }
      });
  }, [vars]);

  const result = { loading, error, data };
  log.debug("use.return:", result);
  return result;
};

export default use;
