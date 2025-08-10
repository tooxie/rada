/* develblock:start */
import "preact/debug";
/* develblock:end */
import { h, Fragment } from "preact";
import { useState, useCallback } from "preact/hooks";

import Logger from "../logger";
import Conf from "../conf/context";
import { getDefaultConf } from "../conf/context";
import type { Conf as ConfType } from "../conf/types";
import AppState from "../state/context";
import useAppState from "../state/hooks/useappstate";

import Auth from "./auth";
import Root from "./root";
import Splash from "./splash";

const log = new Logger(__filename);

const App = () => {
  const [conf, setConf] = useState(getDefaultConf());
  const customSetConf = useCallback(
    (newConf: ConfType) => {
      const serializedConf = JSON.stringify(newConf);
      log.warn(`localStorage.setItem("GawshiConf", ${serializedConf})`);
      localStorage.setItem("GawshiConf", serializedConf);
      setConf({ ...newConf });
    },
    []
  );

  const { appState, dispatch, actions } = useAppState();
  const [loggedIn, setLoggedIn] = useState(false);
  const onLogin = (admin: boolean) => {
    if (admin) dispatch(actions.SetAdmin);
    else dispatch(actions.UnsetAdmin);
    setLoggedIn(true);
  };

  log.debug("appState", appState);

  return (
    <Fragment>
      <Splash />
      <Conf.Provider value={{ conf, setConf: customSetConf }}>
        <AppState.Provider value={{ appState, dispatch, actions }}>
          {loggedIn ? <Root /> : <Auth onLogin={onLogin} />}
        </AppState.Provider>
      </Conf.Provider>
    </Fragment>
  );
};

export default App;
