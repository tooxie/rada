import { createContext } from "preact";

import { AppState, AppStateHook, Actions } from "./types";
import { serverId } from "../config.json";

const defaultAppState: AppState = {
  serverId,
  isAdmin: false,
  isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  isQueueOpen: false,
};

const AppStateContext = createContext<AppStateHook>({
  appState: defaultAppState,
  dispatch: () => defaultAppState,
  actions: Actions,
});

export default AppStateContext;
export { defaultAppState };
