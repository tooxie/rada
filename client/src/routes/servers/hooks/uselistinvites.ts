import type { ListServerInvitesQuery, ServerInvite } from "../../../graphql/api";

import useList from "../../../hooks/uselist";
import { listServerInvites } from "../../../graphql/queries";

type UseListReturn = ReturnType<typeof useList>;
interface UseListServersReturn extends Omit<UseListReturn, "data"> {
  invites: ServerInvite[];
}

const useListInvites = (): UseListServersReturn => {
  const { loading, error, data, refetch } = useList<ListServerInvitesQuery, {}>(
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
