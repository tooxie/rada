import use from "./use";

export default <T>(fnGet: Function, pk: { [k: string]: string }) => {
  const { loading, error, data: item } = use<T>(fnGet, pk);

  return {
    loading,
    error,
    item,
  };
};
