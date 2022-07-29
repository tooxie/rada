import { h } from "preact";

import { Server, ServerInvite } from "../../graphql/api";

import useDeleteInvite from "./hooks/usedeleteinvite";
import useDeleteServer from "./hooks/usedeleteserver";
import trash from "./trash.svg";
import style from "./trash.css";
import { useEffect } from "preact/hooks";

interface TrashServerProps {
  server: Server;
  invite?: never;
  onDelete: (server: Server) => void;
}

interface TrashInviteProps {
  server?: never;
  invite: ServerInvite;
  onDelete: (invite: ServerInvite) => void;
}

type TrashProps = TrashServerProps | TrashInviteProps;

const cutId = (id?: string) => (id ? id.split("-")[0] : "");

const Trash = (props: TrashProps) => {
  if (props.invite) {
    return <TrashInvite invite={props.invite} onDelete={props.onDelete} />;
  }
  if (props.server) {
    return <TrashServer server={props.server} onDelete={props.onDelete} />;
  }

  return <div />;
};

const TrashInvite = (props: TrashInviteProps) => {
  const [deleteInvite, { loading, error, invite }] = useDeleteInvite();

  const handler = () => {
    if (loading) return;

    const msg = `Delete pending invite "${cutId(props.invite.id)}"?`;
    if (confirm(msg)) deleteInvite(props.invite.id);
  };
  const classes = [style.trash, loading ? style.loading : ""];

  useEffect(() => {
    if (invite) props.onDelete(invite);
  }, [invite]);

  if (!loading && !error && invite) return <div />;
  return <img src={trash} class={classes.join(" ")} onClick={handler} />;
};

const TrashServer = (props: TrashServerProps) => {
  const [deleteServer, { loading, error, server }] = useDeleteServer();

  const handler = () => {
    if (loading) return;

    const msg = `Delete server "${props.server.name}" (${cutId(props.server.id)})?`;
    if (confirm(msg)) deleteServer(props.server.id);
  };
  const classes = [style.trash, loading ? style.loading : ""];

  useEffect(() => {
    if (server) props.onDelete(server);
  }, [server]);

  if (!loading && !error && server) return <div />;
  return <img src={trash} class={classes.join(" ")} onClick={handler} />;
};

export default Trash;
