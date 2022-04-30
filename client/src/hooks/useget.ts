import Logger from "../logger";

import use from "./use";

const log = new Logger(__filename);

type UseReturnType = Omit<ReturnType<typeof use>, "data">;
interface UseGetReturn<T> extends UseReturnType {
  item: T | null;
}

const useGet = <T, V>(fnGet: Function, pk: V): UseGetReturn<T> => {
  const { loading, error, data: item } = use<T, V>(fnGet, pk);

  const result = { loading, error, item };
  log.debug("useGet.return:", result);
  return result;
};

export default useGet;
