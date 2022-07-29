import { useState } from "preact/hooks";

import { DeleteServerInviteMutation, ServerInvite } from "../../../graphql/api";
import { deleteServerInvite } from "../../../graphql/mutations";
import Logger from "../../../logger";
import useMutation, { Executing } from "../../../hooks/usemutation";

const log = new Logger(__filename);

interface Creating<T> extends Omit<Executing<T>, "data"> {
  invite: ServerInvite | null;
}
type HookReturn<T> = [Function, Creating<T>];

const useDeleteInvite = (): HookReturn<DeleteServerInviteMutation> => {
  const [invite, setInvite] = useState<ServerInvite | null>(null);
  const [mutator, { loading, error, data }] =
    useMutation<DeleteServerInviteMutation>(deleteServerInvite);

  if (data?.deleteServerInvite) {
    setInvite(data.deleteServerInvite);
  }

  return [
    (id: string) => {
      log.debug(`deleteInvite("${id}")`);
      setInvite(null);
      mutator({ id });
    },
    { loading, error, invite },
  ];
};

export default useDeleteInvite;
