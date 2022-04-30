import { useState, useEffect } from "preact/hooks";

import { getSignedUrl } from "../../utils/s3";
import { Track } from "../../graphql/api";
import q from "../../queue";
import { States } from "../../queue/types";
import { IQueue, AudioEvent, AudioEventListener, IPlayer } from "../../player/types";
import { authenticate, fetchCredentials } from "../../utils/auth";

const reauth = () => authenticate(fetchCredentials());
let wakeLock: WakeLockSentinel | null;
const setMediaMetadata = (track: Track, player: IPlayer) => {
  console.log("[hooks/useplayer.ts] Setting mediasession metadata");
  const getType = (url?: string | null) => {
    if (!url) return "";
    const i = url.lastIndexOf(".");
    if (i === -1) return "";
    const ext = url.substring(i + 1);
    if (ext.length < 3 || ext.length > 4) return "";

    return `image/${ext}`;
  };
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: track.title || "N/A",
    artist: (track.artists || []).map((a) => a.name).join(", "),
    album: track.album.name || "N/A",
    artwork: [
      {
        src: track.album.imageUrl || "",
        type: getType(track.album.imageUrl),
        sizes: "512x512",
      },
    ],
  });
  console.log(
    "[hooks/useplayer.ts] mediaSession.metadata:",
    navigator.mediaSession.metadata
  );
  navigator.mediaSession.playbackState = "playing";

  console.log("[hooks/useplayer.ts] Setting action handlers...");
  navigator.mediaSession.setActionHandler("nexttrack", player.skipNext.bind(player));
  navigator.mediaSession.setActionHandler("pause", player.pause.bind(player));
  navigator.mediaSession.setActionHandler("play", player.play.bind(player));
  navigator.mediaSession.setActionHandler(
    "previoustrack",
    player.skipPrevious.bind(player)
  );
  navigator.mediaSession.setActionHandler("stop", player.stop.bind(player));
  navigator.mediaSession.setActionHandler(
    "seekbackward",
    (ev: MediaSessionActionDetails) => {
      console.log("[hooks/useplayer.ts] EV:", ev);
      player.seekBy((ev.seekOffset || 10) * -1);
    }
  );
  navigator.mediaSession.setActionHandler(
    "seekforward",
    (ev: MediaSessionActionDetails) => {
      console.log("[hooks/useplayer.ts] EV:", ev);
      player.seekBy(ev.seekOffset || 10);
    }
  );
  navigator.mediaSession.setActionHandler("seekto", (ev: MediaSessionActionDetails) => {
    console.log("[hooks/useplayer.ts] EV:", ev);
    if (ev.seekTime !== null && ev.seekTime !== undefined) player.seekTo(ev.seekTime);
  });
};
const requestScreenLock = () => {
  if (!("wakeLock" in navigator)) return;
  console.log("[hooks/useplayer.ts] Requesting screen lock...");
  navigator.wakeLock.request("screen").then((lock: WakeLockSentinel) => {
    wakeLock = lock;
    console.log("[hooks/useplayer.ts] Screen lock acquired");
  });
};
const releaseScreenLock = () => {
  if (!wakeLock) return;
  wakeLock.release().then(() => {
    console.log("[hooks/useplayer.ts] Screen lock released");
    wakeLock = null;
  });
};

class Queue implements IQueue {
  constructor() {
    q.init();
  }
  clear() {
    q.clear();
  }
  setIndex(index: number) {
    q.setIndex(index);
  }
  getTracks() {
    return q.getQueue();
  }
  getIndex() {
    return q.getIndex();
  }
  getCurrentTrack(): Track | null {
    console.log("[hooks/useplayer.ts] getCurrentTrack():", q.getCurrentTrack());
    return q.getCurrentTrack();
  }
  getDuration() {
    const sumLength = (acc: number, track: Track): number => {
      return acc + (track?.lengthInSeconds || 0);
    };
    return this.getTracks().reduce(sumLength, 0);
  }
  append(tracks: Track[]) {
    q.append(tracks);
  }
  next() {
    q.next();
  }
  previous() {
    q.previous();
  }
  removeAt(index: number) {
    q.removeAt(index);
  }
}

const usePlayer = () => {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [_, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<IPlayer>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [queue, setQueue] = useState<Queue>();
  const [track, setTrack] = useState<Track>();

  const forceRender = (x?: number) => setCurrentTime(x || Math.random() * 100);

  let state: States;
  let errored = false;

  if (player) {
    const currentTrack = player.getCurrentTrack();
    if (currentTrack) {
      if (!track || currentTrack.id !== track.id) {
        setTrack(currentTrack);
      }
    }
  }

  if (player) {
    if (loading) {
      state = States.Loading;
    } else {
      if (playing) {
        state = States.Playing;
      } else {
        if (player.getCurrentTime() === 0) {
          state = States.Idle;
        } else {
          state = States.Paused;
        }
      }
    }
    player.state = state;
  }

  useEffect(() => {
    setQueue(new Queue());
    setAudio(new Audio());
  }, []);

  useEffect(() => {
    if (audio && queue) {
      setPlayer({
        __currentTime: 0,
        audio: audio,
        queue: queue,
        state: States.Idle,
        getQueue() {
          return this.queue.getTracks();
        },
        getQueueLength() {
          return this.queue.getTracks().length;
        },
        getIndex() {
          return this.queue.getIndex();
        },
        setIndex(i: number) {
          this.queue.setIndex(i);
        },
        clearQueue() {
          this.stop();
          this.queue.clear();
        },
        replaceQueue(tracks) {
          this.clearQueue();
          this.queue.append(tracks);
        },
        getCurrentTrack(): Track | null {
          console.log("[hooks/useplayer.ts] Getting track from queue");
          return this.queue.getCurrentTrack();
        },
        getCurrentTime(): number {
          return this.__currentTime;
        },
        setCurrentTime(currentTime: number): void {
          this.__currentTime = currentTime;
        },
        async play() {
          const currentTrack = this.getCurrentTrack();
          if (!currentTrack) return;

          const stopped = this.getCurrentTime() === 0;
          const trackChanged = currentTrack.hash !== this.audio.getAttribute("hash");
          if (stopped || trackChanged) {
            const url = await getSignedUrl(currentTrack);
            this.audio.src = url;
            this.audio.setAttribute("hash", currentTrack.hash);
          }

          await this.audio.play();
          // navigator.mediaSession.playbackState = "playing";
          console.log("[hooks/useplayer.ts] Playing!");
          setMediaMetadata(currentTrack, this);
          requestScreenLock();
        },
        pause() {
          this.audio.pause();
          releaseScreenLock();
          // navigator.mediaSession.playbackState = "paused";
        },
        stop() {
          this.audio.pause();
          this.audio.removeAttribute("src");
          this.audio.removeAttribute("hash");
          this.setCurrentTime(0);
          setPlaying(false);
          setLoading(false);
          // navigator.mediaSession.playbackState = "none";
          if (this.atLastTrack()) {
            releaseScreenLock();
          }
        },
        seekBy(delta: number) {
          this.audio.currentTime = this.audio.currentTime + delta;
        },
        seekTo(pos: number) {
          if (pos < 1) this.audio.currentTime = 0;
          else this.audio.currentTime = pos;
        },
        togglePlayback() {
          switch (this.state) {
            case States.Paused:
            case States.Idle:
              this.play();
              break;
            case States.Playing:
            case States.Loading:
              this.pause();
              break;
          }
        },
        isLoading() {
          return this.state === States.Loading;
        },
        isPlaying() {
          return this.state === States.Playing;
        },
        isPaused() {
          return this.state === States.Paused;
        },
        atFirstTrack() {
          return this.queue.getIndex() === 0;
        },
        atLastTrack() {
          return this.queue.getIndex() === this.getQueueLength() - 1;
        },
        skipNext() {
          this.stop();
          this.queue.next();
          this.play();
        },
        skipPrevious() {
          if (this.atFirstTrack()) return;
          this.stop();
          this.queue.previous();
          this.play();
        },
        skipTo(index: number) {
          this.stop();
          this.queue.setIndex(index);
          this.play();
        },
        appendTracks(tracks: Track[]) {
          this.queue.append(tracks);
        },
        removeTrackAt(index: number) {
          const trackIsPlaying = this.isPlaying() && this.queue.getIndex() === index;
          if (trackIsPlaying) this.stop();
          this.queue.removeAt(index);
          forceRender();
        },
      } as IPlayer);
    }
  }, [audio, queue]);

  useEffect(() => {
    if (!player || !audio) return;

    const canPlay = () => setLoading(false);
    const timeUpdate = (ev: AudioEvent): void => {
      const audio = ev.path ? ev.path[0] : ev.currentTarget;
      player.setCurrentTime(audio.currentTime);
    };
    const reset = (ev: Event): void => {
      console.warn(`[hooks/useplayer.ts] reset (${ev.type})`);
      player.setCurrentTime(0);
      setPlaying(false);
    };
    const pause = (ev: AudioEvent): void => {
      console.warn(`[hooks/useplayer.ts] pause (${ev.type})`);
      const audio = ev.path ? ev.path[0] : ev.currentTarget;
      player.setCurrentTime(audio.currentTime);
      setPlaying(false);
      setLoading(false);
    };
    const play = (ev: Event): void => {
      console.warn(`[hooks/useplayer.ts] play (${ev.type})`);
      console.warn(`[hooks/useplayer.ts] "playing" was: ${playing}`);
      setPlaying(true);
      console.warn(`[hooks/useplayer.ts] "loading" was: ${loading}`);
      setLoading(false);
    };
    const suspend = (ev: Event): void => {
      console.warn(`[hooks/useplayer.ts] suspend (${ev.type})`);
      setPlaying(false);
      setLoading(false);
    };
    const waiting = (ev: Event): void => {
      console.warn(`[hooks/useplayer.ts] waiting (${ev.type})`);
      setPlaying(false);
      setLoading(true);
    };
    const next = (ev: Event): void => {
      console.warn(`[hooks/useplayer.ts] next (${ev.type})`);
      if (player.atLastTrack()) {
        console.log(`[hooks/useplayer.ts] End of queue`);
        player.setIndex(0);
        player.setCurrentTime(0);
        setPlaying(false);
        setLoading(false);

        // Don't ask me why I need to do this, but otherwise it won't update
        // the UI after the last track finishes *sigh*
        forceRender();
      } else {
        player.skipNext();
      }
    };
    const error = (ev: Event) => {
      console.warn(`[hooks/useplayer.ts] error (${ev.type})`);
      console.log(ev.target);
      const target = ev.currentTarget as any;
      const errorMsg = target.error?.message || "";
      player.setCurrentTime(0);
      setPlaying(false);
      setLoading(false);
      if (errorMsg.includes("Empty src attribute")) return;
      if (!errored) {
        console.warn(`[hooks/useplayer.ts] [ERROR] Code: ${target.error.code}`);
        console.warn(`[hooks/useplayer.ts] [ERROR] Message: "${target.error.message}"`);
        console.log("[hooks/useplayer.ts] Reauthenticating...");
        reauth().then(() => {
          console.log("[hooks/useplayer.ts] Retrying...");
          player.play().then(() => {
            errored = false;
          });
        });
      } else {
        console.log(ev);
        console.error(target.error);
      }

      errored = true;
    };

    audio.addEventListener("error", error);

    // The `duration` attribute has been updated
    // audio.addEventListener("durationchange", timeUpdate);

    // The browser can play the media, but estimates that not enough data has been loaded
    // to play the media up to its end without having to stop for further buffering of
    // content
    audio.addEventListener("canplay", () => canPlay());

    // The media has become empty; for example, this event is sent if the media has already
    // been loaded (or partially loaded), and the HTMLMediaElement.load method is called to
    // reload it
    // audio.addEventListener("emptied", () => {
    //   console.log("[hooks/useplayer.ts] audio.emptied");
    //   reset();
    // });

    // Playback has stopped because the end of the media was reached
    audio.addEventListener("ended", next);

    // Playback has been paused
    audio.addEventListener("pause", (ev: Event) => pause(ev as AudioEvent));

    // Playback has begun
    audio.addEventListener("play", play);

    // Playback is ready to start after having been paused or delayed due to lack of data
    audio.addEventListener("playing", play);

    // Media data loading has been suspended
    // audio.addEventListener("suspend", () => {
    //   console.log("[hooks/useplayer.ts] audio.suspend");
    //   suspend();
    // });

    // The time indicated by the `currentTime` attribute has been updated
    audio.addEventListener("timeupdate", (ev: Event) => timeUpdate(ev as AudioEvent));

    // Playback has stopped because of a temporary lack of data
    audio.addEventListener("waiting", waiting);

    return () => {
      if (!audio) return;

      audio.removeEventListener("canplay", canPlay);
      audio.removeEventListener("emptied", reset);
      audio.removeEventListener("ended", reset);
      audio.removeEventListener("pause", pause as AudioEventListener);
      audio.removeEventListener("play", play);
      audio.removeEventListener("playing", play);
      audio.removeEventListener("suspend", suspend);
      audio.removeEventListener("timeupdate", timeUpdate as AudioEventListener);
      audio.removeEventListener("waiting", waiting);

      console.log("[hooks/useplayer.ts] MediaSession.metadata = null");
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("stop", null);
      navigator.mediaSession.metadata = null;
    };
  }, [audio, player]);

  return { player };
};

export default usePlayer;
