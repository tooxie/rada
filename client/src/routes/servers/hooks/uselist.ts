import type { ListServersQuery, Server } from "../../../graphql/api";

import useQuery from "../../../hooks/usequery";
import { listServers } from "../../../graphql/queries";

type UseGetReturn = ReturnType<typeof useQuery>;
interface UseListServersReturn extends Omit<UseGetReturn, "data"> {
  servers: Server[];
}

const useListServers = (): UseListServersReturn => {
  const { loading, error, data } = useQuery<ListServersQuery, {}>(listServers, {});

  return {
    loading,
    error,
    servers: data?.listServers?.items || [],
  };
};

export default useListServers;
