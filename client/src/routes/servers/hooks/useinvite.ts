import { useEffect, useState } from "preact/hooks";

import { CreateServerInviteMutation } from "../../../graphql/api";
import { createServerInvite } from "../../../graphql/mutations";
import Logger from "../../../logger";
import useMutation, { Executing } from "../../../hooks/usemutation";

const log = new Logger(__filename);

interface Invite {
  inviteId: string | null;
  clientId: string | null;
  secretUrl: string | null;
  timestamp: number | null;
}
interface Creating<T> extends Omit<Executing<T>, "data"> {
  invite: Invite | null;
}
type HookReturn<T> = [Function, Creating<T>];

const useCreateServerInvite = (): HookReturn<CreateServerInviteMutation> => {
  log.debug("useCreateServerInvite()");
  const [invite, setInvite] = useState<Invite | null>(null);

  const [mutator, { loading, error, data }] =
    useMutation<CreateServerInviteMutation>(createServerInvite);

  useEffect(() => {
    if (data?.createServerInvite) {
      log.debug(`useCreateServerInvite.data: ${JSON.stringify(data)}`);
      setInvite({
        inviteId: data?.createServerInvite?.id,
        clientId: data?.createServerInvite?.clientId,
        secretUrl: data?.createServerInvite?.secretUrl,
        timestamp: data?.createServerInvite?.timestamp,
      });
    }
  }, [data]);

  return [
    () => {
      if (invite) setInvite(null);
      mutator({});
    },
    {
      loading,
      error,
      invite,
    },
  ];
};

export default useCreateServerInvite;
