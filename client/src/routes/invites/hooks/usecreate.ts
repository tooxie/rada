import { useState } from "preact/hooks";

import useClient from "../../../graphql/hooks";
import { CreateInviteInput } from "../../../graphql/api";
import { createInvite } from "../../../graphql/mutations";

type HookFn = (i: CreateInviteInput) => void;
interface HookReturn {
  loading: boolean;
  error?: Error;
  claimUrl?: string;
}

const useCreateInvite = (): [HookFn, HookReturn] => {
  const [claimUrl, setClaimUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const client = useClient();

  const run = (input: CreateInviteInput) => {
    if (!client) throw new Error("No apollo client");

    setLoading(true);
    client
      .mutate({
        mutation: createInvite,
        variables: { input },
      })
      .then(({ data }) => {
        console.log("[invites/hooks/usecreate] useCreateInvite return:", data);
        setClaimUrl(data.createInvite.claimUrl);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  };

  return [run, { loading, error, claimUrl }];
};

export default useCreateInvite;
