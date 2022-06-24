/* develblock:start */
import "preact/debug";
/* develblock:end */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import Conf from "../conf/context";
import useConf from "../conf/hooks/useconf";
import AppState from "../state/context";
import useAppState from "../state/hooks/useappstate";
import Logger from "../logger";
import Splash from "./splash";

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

  log.debug(appState);

  return (
    <Fragment>
      <Splash />
      <Conf.Provider value={{ conf, setConf }}>
        <AppState.Provider value={{ appState, dispatch, actions }}>
          {loggedIn ? <Root /> : <Auth onLogin={onLogin} />}
        </AppState.Provider>
      </Conf.Provider>
    </Fragment>
  );
};

export default App;
