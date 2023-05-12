import type { Track } from "../graphql/api";

import { States, Action } from "./enums";

export interface ReducerAction {
  type: Action;
  index?: number;
  tracks?: Track[];
  length?: number;
  currentTime?: number;
}

export interface Queue {
  tracks: Track[];
  index: number;
}

export interface ReducerState {
  queue: Queue;
  state: States;
  time: number;
  getCurrentTrack: () => Track | null;
}

interface TrackCache {
  [key: `q.track-${number}`]: Track;
}

export interface Storage {
  __clearLocalStorage: (i?: number) => void;
  __index: number;
  __init: boolean;
  __length: number;
  cache: TrackCache;
  clear: () => void;
  getIndex: () => number;
  getItem: (k: string) => Track | null;
  getLength: () => number;
  reindex: (i: number) => void;
  removeItem: (k: string) => void;
  saveToCache: (k: string, v: any) => void;
  setIndex: (i: number) => void;
  setItem: (k: string, v: any) => void;
  updateLength: () => void;
}
