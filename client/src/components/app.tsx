/* develblock:start */
import "preact/debug";
/* develblock:end */
import { h } from "preact";
import { useState } from "preact/hooks";

import Conf from "../conf/context";
import useConf from "../conf/hooks/useconf";
import AppState from "../state/context";
import useAppState from "../state/hooks/useappstate";
import Apollo from "../graphql/context";
import getClient, { Client } from "../graphql/client";
import Logger from "../logger";

import Root from "./root";
import Auth from "./auth";

const log = new Logger(__filename);

const App = () => {
  const { conf, setConf } = useConf();
  const { appState, dispatch, actions } = useAppState();
  const [client, setClient] = useState<Client>();
  const [loggedIn, setLoggedIn] = useState(false);
  const onLogin = (admin: boolean) => {
    if (admin) dispatch(actions.SetAdmin);
    else dispatch(actions.UnsetAdmin);
    setLoggedIn(true);
  };

  getClient().then((c: Client) => setClient(c));

  log.debug(
    loggedIn ? `Logged in ${appState.isAdmin ? "as admin" : ""}` : "Anonymous user"
  );
  log.warn(appState);

  return (
    <Conf.Provider value={{ conf, setConf }}>
      <AppState.Provider value={{ appState, dispatch, actions }}>
        {loggedIn ? (
          <Apollo.Provider value={client}>
            <Root />
          </Apollo.Provider>
        ) : (
          <Auth onLogin={onLogin} />
        )}
      </AppState.Provider>
    </Conf.Provider>
  );
};

export default App;
