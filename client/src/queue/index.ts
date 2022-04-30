import { Track as ITrack } from "../graphql/api";
// import { TrackId } from "../types";

import Logger from "../logger";

const log = new Logger(__filename);

interface Track extends ITrack {
  [key: string]: any;
}

// Just a convenience
const readLength = (): number => {
  const key = "q.__meta__.length";
  return parseInt(localStorage.getItem(key) || "0", 10);
};

// TODO: Write an interface for this
const storage = {
  __init: false,
  __length: 0,
  __index: -1,
  cache: {},
  saveToCache: function (key: string, value: any) {
    (this.cache as any)[key] = value;
  },
  clear: function () {
    this.cache = {};
    this.__clearLocalStorage();
    this.setIndex(-1);
  },
  __clearLocalStorage: function (index?: number): void {
    log.debug(`__clearLocalStorage(${index})`);
    for (let x = index ? index : 0; x < this.getLength(); x++) {
      log.debug(`Removing item with key q.track-${x}`);
      localStorage.removeItem(`q.track-${x}`);
    }
  },
  // __updateLocalStorage: function (): void {
  //   for (let x = 0; x < this.getLength() - 1; x++) {
  //     const key = `q.track-${x}`;
  //     const value = (this.cache as any)[key];
  //     localStorage.setItem(key, JSON.stringify(value));
  //   }
  // },
  setItem: function (key: string, value: any): void {
    if (!value || value === "undefined") throw new Error(`No value for item "${key}"`);
    this.saveToCache(key, value);
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: function (key: string): Track | null {
    log.debug(`Getting track under key "${key}"`);
    return (this.cache as any)[key] || null;
  },
  removeItem: function (key: string): void {
    delete (this.cache as any)[key];
    localStorage.removeItem(key);
  },
  updateLength: function (): void {
    const length = this.getLength().toString();
    log.debug(`Setting new length to ${length}`);
    localStorage.setItem("q.__meta__.length", length);
  },
  getLength: function (): number {
    return Object.keys(this.cache).length;
  },
  setIndex: function (index: number): void {
    localStorage.setItem("q.__meta__.index", index.toString());
    this.__index = index;
  },
  getIndex: function (): number {
    return this.__index;
  },
  reindex: function (i: number) {
    interface FindNextReturn {
      next: Track | null;
      pos: number;
    }
    const findNext = (start: number, end: number): FindNextReturn => {
      for (let y = start; y < end; y++) {
        const next = this.getItem(`q.track-${y}`);
        if (next) return { next, pos: y };
      }

      return { next: null, pos: -1 };
    };

    const oldLength = readLength();
    this.__clearLocalStorage(i);
    for (let x = i; x < oldLength; x++) {
      const track = this.getItem(`q.track-${x}`);
      log.debug(`track (${x}): ${track?.title}`);
      if (!track) {
        const { next, pos } = findNext(x + 1, oldLength);
        if (next) {
          log.debug(`Setting track "${next.title}" in position ${x}`);
          this.setItem(`q.track-${x}`, next);
          log.debug(`Clearing position ${pos}`);
          this.removeItem(`q.track-${pos}`);
        }
      }
    }
  },
};

const init = () => {
  log.debug(`init()${storage.__init ? " -> noop" : ""}`);
  if (storage.__init) return;

  const storedLength = readLength();
  for (let x = 0; x < storedLength; x++) {
    const track = JSON.parse(localStorage.getItem(`q.track-${x}`) || "null");
    if (track) storage.saveToCache(`q.track-${x}`, track);
  }

  const computedLength = storage.getLength();
  if (storedLength !== computedLength) {
    log.warn(`Warning: Expected ${storedLength} tracks, found ${computedLength}`);
  }

  const iKey = "q.__meta__.index";
  const emptyQueue = storage.getLength() === 0;
  let index = parseInt(localStorage.getItem(iKey) || "-1", 10);

  // Sanitization
  if (emptyQueue && index !== -1) {
    log.warn(`Warning: Index out of bounds: Index at ${index} with an empty queue`);
    index = -1;
  } else if (!emptyQueue && index === -1) {
    log.warn("Warning: Index out of bounds: Index at -1 with a non-empty queue");
    index = 0;
  }

  storage.updateLength();
  storage.setIndex(index);

  storage.__init = true;
  log.debug("Initialization finished", storage);
};

const getIndex = () => storage.getIndex();
const setIndex = (index: number) => storage.setIndex(index);
const getLength = () => storage.getLength();
// const setLength = (length: number) => storage.setLength(length);
const clear = () => storage.clear();

const shiftIndex = (offset: number) => {
  const qLength = getLength();
  if (qLength === 0) return setIndex(-1);

  const qIndex = getIndex();
  const maxIndex = qLength - 1;
  const newIndex = qIndex + offset;

  if (newIndex <= 0) return setIndex(0);
  if (newIndex > maxIndex) return setIndex(maxIndex);

  setIndex(newIndex);
};
const next = () => shiftIndex(1);
const previous = () => shiftIndex(-1);
const ended = () => getIndex() + 1 === getLength();
const setTrackAt = (i: number, track: Track) => {
  storage.setItem(`q.track-${i}`, track);
  if (i <= getIndex()) shiftIndex(1);
};
const insertTrackAt = (track: Track, i: number) => {
  if (!track.id) return;
  setTrackAt(i, track);
};
const append = (tracks: Track[]) => {
  const qLength = getLength();
  tracks.forEach((track, i) => insertTrackAt(track, i + qLength));
  storage.updateLength();
  if (getIndex() === -1) shiftIndex(1);
};
const replace = (tracks: Track[]) => {
  tracks.forEach(insertTrackAt);
  storage.updateLength();
};
const getTrack = (i: number): Track | null => storage.getItem(`q.track-${i}`);
const removeTrackAt = (i: number) => {
  log.debug(`removeTrackAt(${i})`);
  storage.removeItem(`q.track-${i}`);
  log.debug(`Shifting index by -1`);
  if (i <= getIndex()) shiftIndex(-1);
  // If we remove an item that leaves a gap in the queue, for example, we
  // have 3 items and we remove the 2nd, we have to reindex the queue so that
  // it's a continuous sequence again without any gaps.
  log.debug(`${i < getLength() ? "Reindexing" : "noop"}`);
  if (i < getLength()) storage.reindex(i);
};

const getCurrentTrack = () => getTrack(getIndex());
const removeAt = (i: number) => {
  log.debug(`Removing track at ${i}`);
  log.debug(`Current length is ${getLength()}`);
  removeTrackAt(i);
  storage.updateLength();
};

const getQueue = (): Track[] => {
  const l = getLength();
  const trackList = [];
  for (let i = 0; i < l; i++) {
    const track = getTrack(i);
    if (track) trackList.push(track);
  }

  return trackList;
};

export default {
  append,
  clear,
  ended,
  getCurrentTrack,
  getIndex,
  getQueue,
  getLength,
  getTrack,
  init,
  next,
  previous,
  removeAt,
  replace,
  setIndex,
};
