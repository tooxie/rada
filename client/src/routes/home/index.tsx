import "preact/debug";
import { h } from "preact";
import { route } from "preact-router";

import useAppState from "../../hooks/useappstate";
import Spinner from "../../components/spinner";

const Home = () => {
  const { appState } = useAppState();
  route(`/server/${appState.homeServerId}/artists`);

  return <Spinner />;
};

export default Home;
