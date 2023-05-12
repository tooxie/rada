import { Invite, ListInvitesQuery } from "../../../graphql/api";
import { listInvites } from "../../../graphql/queries";
import useList from "../../../hooks/uselist";
import type { ServerId } from "../../../types";

const useListInvites = (serverId: ServerId) => {
  const { loading, error, items, refetch } = useList<ListInvitesQuery, Invite>(
    listInvites,
    serverId
  );

  return { loading, error, invites: items, refetch };
};

export default useListInvites;
