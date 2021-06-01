import { useState, useEffect } from "preact/hooks";

export default <T>(fn: Function, ...args: any[]) => {
  console.log("use");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("use.useEffect");
    fn(...args)
      .then((data: T) => {
        console.log("use.useEffect.fn data: ");
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.log("use.useEffect.fn error: " + error);
        console.log(fn.toString());
        setError(error);
        setLoading(false);
      });
  }, args);

  console.log("use.return:");
  console.log({ loading, error, data });
  return {
    loading,
    error,
    data
  };
};
