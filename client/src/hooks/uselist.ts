import use from "./use";

interface Return<T> {
  loading: boolean;
  error?: Error | null;
  items: T[];
}

export default <T>(fnList: Function, variables: { [k: string]: string }): Return<T> => {
  console.log("useList");
  const { loading, error, data: items } = use<T[]>(fnList, variables);

  console.log("useList.return:");
  return {
    loading,
    error,
    items: items || [],
  };
};
