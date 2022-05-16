import { useReducer } from "preact/hooks";

import Logger from "../../logger";
import { AppState, AppStateHook, AppStateReducer, Actions } from "../types";
import { defaultAppState } from "../context";

const log = new Logger(__filename);

const reducer: AppStateReducer = (state: AppState, action: Actions): AppState => {
  log.debug("Reducing:", action, state)
  switch (action) {
    case Actions.SetAdmin:
      state.isAdmin = true;
      break;
    case Actions.UnsetAdmin:
      state.isAdmin = false;
      break;
    case Actions.OpenQueue:
      state.isQueueOpen = true;
      break;
    case Actions.CloseQueue:
      state.isQueueOpen = false;
      break;
    case Actions.SetSafari:
      state.isSafari = true;
      break;
    case Actions.UnsetSafari:
      state.isSafari = false;
      break;
  }

  log.debug("New state:", state)
  return { ...state };
};

const useAppState = (): AppStateHook => {
  const [appState, dispatch] = useReducer(reducer, defaultAppState);
  return { appState, dispatch, actions: Actions };
};

export default useAppState;
