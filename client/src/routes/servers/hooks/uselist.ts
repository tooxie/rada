import type { ListServersQuery, Server } from "../../../graphql/api";

import config from "../../../config.json";
import useList from "../../../hooks/uselist";
import { listServers } from "../../../graphql/queries";

type UseGetReturn = ReturnType<typeof useList>;
interface UseListServersReturn extends Omit<UseGetReturn, "items"> {
  servers: Server[];
}

const useListServers = (): UseListServersReturn => {
  const { loading, error, items, refetch } = useList<ListServersQuery, Server>(
    listServers,
    config.server.id
  );

  return {
    loading,
    error,
    servers: items || [],
    refetch,
  };
};

export default useListServers;
