import type { Reducer } from "preact/hooks";

export interface AppState {
  isAdmin: boolean;  // Whether to show the "friends" and "servers" tabs
  isSafari: boolean;  // Useful for some Safari-specific hacks
  isQueueOpen: boolean;  // Whether the player is open
  homeServerId: string;  // The ID of the home server
  showServers: boolean;  // Whether to show the servers icon in the navigation
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
