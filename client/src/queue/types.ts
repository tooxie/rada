import { Track } from "../graphql/api";

export enum States {
  Idle,
  Loading,
  Playing,
  Paused,
}

export enum Action {
  Append,
  Clear,
  Play,
  SkipNext,
  SkipPrevious,
  RemoveAt,
  SetIndex,
  UpdateTime,
}

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
