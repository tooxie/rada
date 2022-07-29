import type { ListServerInvitesQuery, ServerInvite } from "../../../graphql/api";

import useQuery from "../../../hooks/usequery";
import { listServerInvites } from "../../../graphql/queries";

type UseGetReturn = ReturnType<typeof useQuery>;
interface UseListServersReturn extends Omit<UseGetReturn, "data"> {
  invites: ServerInvite[];
}

const useListInvites = (): UseListServersReturn => {
  const { loading, error, data, refetch } = useQuery<ListServerInvitesQuery, {}>(
    listServerInvites,
    {}
  );

  return {
    loading,
    error,
    invites: data?.listServerInvites?.items || [],
    refetch,
  };
};

export default useListInvites;
