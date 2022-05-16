import type { Reducer } from "preact/hooks";

export interface AppState {
  isAdmin: boolean;
  isSafari: boolean;
  isQueueOpen: boolean;
}

export interface AppStateHook {
  appState: AppState;
  dispatch: (a: Actions) => void;
  actions: ReducerActions;
}

export enum Actions {
  OpenQueue = "openQueue",
  CloseQueue = "closeQueue",
  SetSafari = "setSafari",
  UnsetSafari = "unsetSafari",
  SetAdmin = "setAdmin",
  UnsetAdmin = "unsetAdmin",
}

export type AppStateReducer = Reducer<AppState, Actions>;
export type ReducerActions = typeof Actions;
