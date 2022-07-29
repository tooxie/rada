import type { Reducer } from "preact/hooks";

export interface AppState {
  isAdmin: boolean;
  isSafari: boolean;
  isQueueOpen: boolean;
  serverId: string;
  showServers: boolean;
}

export interface AppStateHook {
  appState: AppState;
  dispatch: (a: Action) => void;
  actions: ReducerActions;
}

export enum Action {
  OpenQueue = "openQueue",
  CloseQueue = "closeQueue",
  SetSafari = "setSafari",
  UnsetSafari = "unsetSafari",
  SetAdmin = "setAdmin",
  UnsetAdmin = "unsetAdmin",
  SetShowServers = "setShowServers",
  UnsetShowServers = "unsetShowServers",
}

export type AppStateReducer = Reducer<AppState, Action>;
export type ReducerActions = typeof Action;
