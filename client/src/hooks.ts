// TODO: Move hooks into a folder with independent files
import { useState, useEffect } from "preact/hooks";
import {
  ApolloQueryResult,
  DocumentNode,
  TypedDocumentNode,
  ApolloClient,
  NormalizedCacheObject
} from "@apollo/client";

export const useGet = <T>(id: string, fnGet: Function) => {
  const { loading, error, data: item } = use<T>(fnGet, id);

  return {
    loading,
    error,
    item
  };
};

export const useList = <T>(fnList: Function) => {
  console.log("useList");
  const { loading, error, data: items } = use<T>(fnList);

  console.log("useList.return:");
  return {
    loading,
    error,
    items
  };
};

export const use = <T>(fn: Function, ...args: any[]) => {
  console.log("use");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("use.useEffect");
    // const { loading, data, error } =
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
    // console.log("use.useEffect data: ");
    // console.log(data);
    // setData(data);
    // console.log("use.useEffect loading: " + loading);
    // setLoading(loading);
    // if (error) setError(error);
    // console.log("use.useEffect error: " + error);
  }, args);

  console.log("use.return:");
  console.log({ loading, error, data });
  return {
    loading,
    error,
    data
  };
};

type C = ApolloClient<NormalizedCacheObject>;
type Q = DocumentNode | TypedDocumentNode;
export const useQuery = <T, V>(client: C, query: Q, variables: V) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  console.log("useQuery");
  client
    .query({
      query,
      variables
    })
    .then(data => {
      console.log(`useQuery got data:`);
      console.log(data);
      setData((data as ApolloQueryResult<T>).data);
      setLoading(false);
    })
    .catch(error => {
      console.log(`useQuery got error: ${error}`);
      setError(error);
      setLoading(false);
    });

  console.log("useQuery.return:");
  console.log({ loading, error, data });
  return { loading, error, data };
};
