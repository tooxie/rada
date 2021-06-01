import use from "./use";

export default <T>(id: string, fnGet: Function) => {
  const { loading, error, data: item } = use<T>(fnGet, id);

  return {
    loading,
    error,
    item
  };
};
