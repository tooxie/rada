import { useState } from "preact/hooks";

import { CreateInviteMutation, CreateInviteInput } from "../../../graphql/api";
import { createInvite } from "../../../graphql/mutations";
import Logger from "../../../logger";
import useMutation, { Executing } from "../../../hooks/usemutation";

const log = new Logger(__filename);

interface Creating<T> extends Omit<Executing<T>, "data"> {
  claimUrl: string | null;
}
type HookReturn<T> = [Function, Creating<T>];

const useCreateInvite = (): HookReturn<CreateInviteMutation> => {
  log.debug("useCreateInvite()");
  const [claimUrl, setClaimUrl] = useState<string | null>(null);
  const [mutator, { loading, error, data }] =
    useMutation<CreateInviteMutation, { input: CreateInviteInput }>(createInvite);

  if (data?.createInvite) {
    log.debug("useCreateInvite.data", data);
    setClaimUrl(data.createInvite.claimUrl);
  }

  return [
    (variables: CreateInviteInput) => {
      setClaimUrl(null);
      mutator({ input: variables });
    },
    { loading, error, claimUrl },
  ];
};

export default useCreateInvite;
