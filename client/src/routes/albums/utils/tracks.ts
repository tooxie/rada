import type { Track } from "../../../graphql/api";

export const hasUrl = (track: Track) => Boolean(track.url);
export const byVolume = (t1: Track, t2: Track) => {
  if (t1.volume !== t2.volume) {
    return t1.volume - t2.volume;
  }
  if (t1.side !== t2.side) {
    return t1.side - t2.side;
  }
  if ((t1.ordinal || 1) !== (t2.ordinal || 1)) {
    return (t1.ordinal || 1) - (t2.ordinal || 1);
  }

  return 0;
};
