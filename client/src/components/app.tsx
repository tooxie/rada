/* develblock:start */
import "preact/debug";
/* develblock:end */
import { h } from "preact";
import { useState } from "preact/hooks";

import Conf from "../conf/context";
import useConf from "../conf/hooks/useconf";
import AppState from "../state/context";
import useAppState from "../state/hooks/useappstate";
import Logger from "../logger";

import Root from "./root";
import Auth from "./auth";

const log = new Logger(__filename);

const App = () => {
  const { conf, setConf } = useConf();
  const { appState, dispatch, actions } = useAppState();
  const [loggedIn, setLoggedIn] = useState(false);
  const onLogin = (admin: boolean) => {
    if (admin) dispatch(actions.SetAdmin);
    else dispatch(actions.UnsetAdmin);
    setLoggedIn(true);
  };

  log.debug(
    loggedIn ? `Logged in ${appState.isAdmin ? "as admin" : ""}` : "Anonymous user"
  );
  log.warn(appState);

  return (
    <Conf.Provider value={{ conf, setConf }}>
      <AppState.Provider value={{ appState, dispatch, actions }}>
        {loggedIn ? <Root /> : <Auth onLogin={onLogin} />}
      </AppState.Provider>
    </Conf.Provider>
  );
};

export default App;
