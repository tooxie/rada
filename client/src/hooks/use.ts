import { useState, useEffect } from "preact/hooks";

export default <T>(fn: Function, params: object) => {
  const fnSig = fn.toString().split("\n")[0];
  console.log(`use("${fnSig.substr(0, fnSig.length - 2)}", ${JSON.stringify(params)})`);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("use.useEffect");
    fn(params)
      .then((data: T) => {
        console.log("use.useEffect.fn data: ");
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.log("use.useEffect.fn error:");
        console.error(error);
        console.log(`params: (${typeof params}) ${JSON.stringify(params)}`);
        console.log(fn.toString());
        setError(error);
        setLoading(false);
      });
  }, []);

  console.log("use.return:");
  console.log({ loading, error, data });
  return {
    loading,
    error,
    data,
  };
};
