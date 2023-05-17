import { useState } from "preact/hooks";

import {
  RegisterServerMutation,
  RegisterServerMutationVariables,
  Server,
} from "../../../graphql/api";
import { registerServer } from "../../../graphql/mutations";
import Logger from "../../../logger";
import useMutation, { Executing } from "../../../hooks/usemutation";

const log = new Logger(__filename);

interface Creating<T> extends Omit<Executing<T>, "data"> {
  server: Server | null;
}
type HookReturn<T> = [Function, Creating<T>];

const useRegisterServer = (): HookReturn<RegisterServerMutation> => {
  log.debug(`useRegisterServer()`);
  const [server, setServer] = useState<Server | null>(null);
  const [mutator, { loading, error, data }] =
    useMutation<RegisterServerMutation>(registerServer);

  if (data?.registerServer) {
    setServer(data.registerServer);
  }

  return [
    (input: RegisterServerMutationVariables) => {
      log.debug("registerServer.input", input);
      setServer(null);
      mutator({ input });
    },
    { loading, error, server },
  ];
};

export default useRegisterServer;
