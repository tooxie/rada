import { createContext } from "preact";

import { AppState, AppStateHook, Action } from "./types";
import config from "../config.json";

const defaultAppState: AppState = {
  homeServerId: config.server.id,
  isAdmin: false,
  isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  isQueueOpen: false,
  showServers: false,
};

const AppStateContext = createContext<AppStateHook>({
  appState: defaultAppState,
  dispatch: () => defaultAppState,
  actions: Action,
});

export default AppStateContext;
export { defaultAppState };
