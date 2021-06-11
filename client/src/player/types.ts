import { Track } from "../graphql/api";
import { States } from "../queue/types";

export interface IQueue {
  append: (t: Track[]) => void;
  clear: () => void;
  getCurrentTrack: () => Track | null;
  getDuration: () => number;
  getIndex: () => number;
  getTracks: () => Track[];
  setIndex: (i: number) => void;
  next: () => void;
  previous: () => void;
  removeAt: (i: number) => void;
}

export interface AudioEvent extends Omit<Event, "currentTarget"> {
  path?: HTMLAudioElement[];
  currentTarget: HTMLAudioElement;
}
export interface AudioEventListener extends EventListener {
  this: HTMLAudioElement;
  ev?: AudioEvent;
}

export interface IPlayer {
  audio: HTMLAudioElement;
  queue: IQueue;
  state: States;
  __currentTime: number;

  getCurrentTime: () => number;
  setCurrentTime: (t: number) => void;
  getCurrentTrack: () => Track | null;
  getIndex: () => number;
  setIndex: (i: number) => void;
  getQueue: () => Track[];
  getQueueLength: () => number;
  replaceQueue: (tt: Track[]) => void;
  appendTracks: (tt: Track[]) => void;
  removeTrackAt: (i: number) => void;

  atFirstTrack: () => boolean;
  atLastTrack: () => boolean;
  isLoading: () => boolean;
  isPaused: () => boolean;
  isPlaying: () => boolean;

  pause: () => void;
  play: () => Promise<void>;
  stop: () => void;
  seekBy: (d: number) => void;
  seekTo: (p: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
  skipTo: (i: number) => void;
  togglePlayback: () => void;
  clearQueue: () => void;
  stopAfter: (i: number) => void;
}
