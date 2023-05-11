import type { ListServersQuery, Server } from "../../../graphql/api";

import useList from "../../../hooks/uselist";
import { listServers } from "../../../graphql/queries";

type UseListReturn = ReturnType<typeof useList>;
interface UseListServersReturn extends Omit<UseListReturn, "data"> {
  servers: Server[];
}

const useListServers = (): UseListServersReturn => {
  const { loading, error, data, refetch } = useList<ListServersQuery, {}>(
    listServers,
    {}
  );

  return {
    loading,
    error,
    servers: data?.listServers?.items || [],
    refetch,
  };
};

export default useListServers;
