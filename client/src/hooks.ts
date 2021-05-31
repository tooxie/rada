import { useState, useEffect } from "preact/hooks";

export const useGet = <T>(id: string, fnGet: Function) => {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      const { loading, data, error } = fnGet(id);
      setItem(data);
      setLoading(loading);
      if (error) setError(error);
    }
  }, [id]);

  return {
    loading,
    error,
    item
  };
};
