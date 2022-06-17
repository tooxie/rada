import { h } from "preact";
import { route } from "preact-router";

import useAppState from "../../hooks/useappstate";

const Redirect = () => {
  const { appState } = useAppState();
  route(`/server/${appState.serverId}${window.location.pathname}`);

  return null;
};

export default Redirect;
