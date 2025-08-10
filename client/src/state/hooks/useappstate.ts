import { useReducer } from "preact/hooks";

import Logger from "../../logger";
import { AppState, AppStateHook, AppStateReducer, Action } from "../types";
import { defaultAppState } from "../context";

const log = new Logger(__filename);

const reducer: AppStateReducer = (state: AppState, action: Action): AppState => {
  log.debug("Reducing:", action, state);
  switch (action) {
    case Action.SetAdmin:
      state.isAdmin = true;
      break;
    case Action.UnsetAdmin:
      state.isAdmin = false;
      break;
    case Action.OpenQueue:
      state.isQueueOpen = true;
      break;
    case Action.CloseQueue:
      state.isQueueOpen = false;
      break;
    case Action.SetSafari:
      state.isSafari = true;
      break;
    case Action.UnsetSafari:
      state.isSafari = false;
      break;
    case Action.SetShowServers:
      state.showServers = true;
      break;
    case Action.UnsetShowServers:
      state.showServers = false;
      break;
    default:
      throw new Error(`Unrecognized action "${action}"`);
  }

  log.debug("New state:", state);
  return { ...state };
};

const useAppState = (): AppStateHook => {
  const [appState, dispatch] = useReducer(reducer, defaultAppState);
  return { appState, dispatch, actions: Action };
};

export default useAppState;
