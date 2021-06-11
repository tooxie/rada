import { Invite, ListInvitesQuery } from "../../../graphql/api";
import { listInvites } from "../../../graphql/queries";
import useQuery from "../../../hooks/usequery";

const useListInvites = () => {
  const { loading, error, data } = useQuery<ListInvitesQuery, object>(listInvites, {});
  const invites = (data?.listInvites?.items || []) as Invite[];

  return { loading, error, invites };
};

export default useListInvites;
