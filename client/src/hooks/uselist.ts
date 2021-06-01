import use from "./use";

export default <T>(fnList: Function) => {
  console.log("useList");
  const { loading, error, data: items } = use<T>(fnList);

  console.log("useList.return:");
  return {
    loading,
    error,
    items
  };
};
