import { Invite, ListInvitesQuery } from "../../../graphql/api";
import { listInvites } from "../../../graphql/queries";
import useList from "../../../hooks/uselist";

const useListInvites = () => {
  const { loading, error, data } = useList<ListInvitesQuery, object>(listInvites, {});
  const invites = (data?.listInvites?.items || []) as Invite[];

  return { loading, error, invites };
};

export default useListInvites;
