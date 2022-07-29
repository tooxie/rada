import { useState } from "preact/hooks";

import { DeleteServerMutation, Server } from "../../../graphql/api";
import { deleteServer } from "../../../graphql/mutations";
import Logger from "../../../logger";
import useMutation, { Executing } from "../../../hooks/usemutation";

const log = new Logger(__filename);

interface Creating<T> extends Omit<Executing<T>, "data"> {
  server: Server | null;
}
type HookReturn<T> = [Function, Creating<T>];

const useDeleteServer = (): HookReturn<DeleteServerMutation> => {
  log.debug(`useDeleteServer()`);
  const [server, setServer] = useState<Server | null>(null);
  const [mutator, { loading, error, data }] =
    useMutation<DeleteServerMutation>(deleteServer);

  if (data?.deleteServer) {
    setServer(data.deleteServer);
  }

  return [
    (id: string) => {
      log.debug(`deleteServer("${id}")`);
      setServer(null);
      mutator({ id });
    },
    { loading, error, server },
  ];
};

export default useDeleteServer;
