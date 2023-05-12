import type { ListServerInvitesQuery, ServerInvite } from "../../../graphql/api";

import config from "../../../config.json";
import useList from "../../../hooks/uselist";
import { listServerInvites } from "../../../graphql/queries";

type UseGetReturn = ReturnType<typeof useList>;
interface UseListServersReturn extends Omit<UseGetReturn, "items"> {
  invites: ServerInvite[];
}

const useListInvites = (): UseListServersReturn => {
  const { loading, error, items, refetch } = useList<
    ListServerInvitesQuery,
    ServerInvite
  >(listServerInvites, config.server.id);

  return {
    loading,
    error,
    invites: items,
    refetch,
  };
};

export default useListInvites;
