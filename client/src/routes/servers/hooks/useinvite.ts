import { useEffect, useState } from "preact/hooks";

import type {
  CreateServerInviteMutation,
  CreateServerInviteResponse,
} from "../../../graphql/api";

import { createServerInvite } from "../../../graphql/mutations";
import Logger from "../../../logger";
import useMutation, { Executing } from "../../../hooks/usemutation";

const log = new Logger(__filename);

type Invite = Omit<CreateServerInviteResponse, "__typename">;
interface Creating<T> extends Omit<Executing<T>, "data"> {
  invite: Invite | null;
}
type HookReturn<T> = [Function, Creating<T>];

const useCreateServerInvite = (): HookReturn<Invite> => {
  log.debug("useCreateServerInvite()");
  const [invite, setInvite] = useState<Invite | null>(null);
  const [mutator, { loading, error, data }] =
    useMutation<CreateServerInviteMutation, Record<string, never>>(createServerInvite);

  useEffect(() => {
    if (data?.createServerInvite) {
      const invite: Invite = {
        id: data.createServerInvite.id,
        timestamp: data.createServerInvite.timestamp,
        secret: data.createServerInvite.secret,
        clientIdUrl: data.createServerInvite.clientIdUrl,
      };
      log.debug(`useCreateServerInvite.invite: ${invite}`);
      setInvite(invite);
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
