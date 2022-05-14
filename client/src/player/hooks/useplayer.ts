import { useState, useEffect } from "preact/hooks";

import { getSignedUrl } from "../../utils/s3";
import { Track } from "../../graphql/api";
import q from "../../queue";
import { States } from "../../queue/types";
import { IQueue, AudioEvent, AudioEventListener, IPlayer } from "../../player/types";
import { authenticate, fetchCredentials } from "../../utils/auth";
import Logger from "../../logger";

const log = new Logger(__filename);
const reauth = () => authenticate(fetchCredentials());
let wakeLock: WakeLockSentinel | null;
const requestScreenLock = () => {
  if (!("wakeLock" in navigator)) return;
  log.debug("Requesting screen lock...");
  navigator.wakeLock.request("screen").then((lock: WakeLockSentinel) => {
    wakeLock = lock;
    log.debug("Screen lock acquired");
  });
};
const releaseScreenLock = () => {
  if (!wakeLock) return;
  wakeLock.release().then(() => {
    log.debug("Screen lock released");
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
    log.debug("q.getCurrentTrack()");
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
  const [player, setPlayer] = useState<IPlayer>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [queue, setQueue] = useState<Queue>();
  const [track, setTrack] = useState<Track>();

  const [_, setX] = useState(0);
  const forceRender = (x?: number) => setX(x || Math.random() * 100);

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
          log.debug("player.clearQueue()");
          this.stop();
          this.queue.clear();
          forceRender();
        },
        replaceQueue(tracks) {
          this.clearQueue();
          this.queue.append(tracks);
          forceRender();
        },
        getCurrentTrack(): Track | null {
          log.debug("player.getCurrentTrack()");
          return this.queue.getCurrentTrack();
        },
        getCurrentTime(): number {
          return this.audio.currentTime;
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
          log.debug("Playing!");
          requestScreenLock();
        },
        pause() {
          this.audio.pause();
          releaseScreenLock();
          // navigator.mediaSession.playbackState = "paused";
        },
        stop() {
          log.debug("player.stop()");
          this.audio.pause();
          this.audio.removeAttribute("src");
          this.audio.removeAttribute("hash");
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
          log.debug("player.skipNext()");
          this.stop();
          this.queue.next();
          this.play();
        },
        skipPrevious() {
          log.debug("player.skipPrevious()");
          if (this.atFirstTrack()) return;
          this.stop();
          this.queue.previous();
          this.play();
        },
        skipTo(index: number) {
          log.debug("player.skipTo()");
          this.stop();
          this.queue.setIndex(index);
          this.play();
        },
        appendTracks(tracks: Track[]) {
          this.queue.append(tracks);
          forceRender();
        },
        removeTrackAt(index: number) {
          log.debug(`player.removeTrackAt(${index})`);
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
    };
    const reset = (ev: Event): void => {
      log.debug(`Event: reset (${ev.type})`);
      setPlaying(false);
    };
    const pause = (ev: AudioEvent): void => {
      log.debug(`Event: pause (${ev.type})`);
      const audio = ev.path ? ev.path[0] : ev.currentTarget;
      setPlaying(false);
      setLoading(false);
    };
    const play = (ev: Event): void => {
      log.debug(`Event: play (${ev.type})`);
      setPlaying(true);
      setLoading(false);
    };
    const suspend = (ev: Event): void => {
      log.debug(`Event: suspend (${ev.type})`);
      setPlaying(false);
      setLoading(false);
    };
    const waiting = (ev: Event): void => {
      log.debug(`Event: waiting (${ev.type})`);
      setPlaying(false);
      setLoading(true);
    };
    const next = (ev: Event): void => {
      log.debug(`Event: next (${ev.type})`);
      if (player.atLastTrack()) {
        log.debug(`End of queue`);
        player.setIndex(0);
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
      log.warn(`Event: error (${ev.type})`);
      const target = ev.currentTarget as any;
      setPlaying(false);
      setLoading(false);
      log.warn(`"${target.error.message}"`);
      if (!errored) {
        log.warn(`[ERROR] Code: ${target.error.code}`);
        log.warn(`[ERROR] Message: "${target.error.message}"`);
        log.debug("Reauthenticating...");
        reauth().then(() => {
          log.debug("Retrying...");
          player.play().then(() => {
            errored = false;
          });
        });
      } else {
        log.debug(ev);
        log.error(target.error);
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
    //   log.debug("audio.emptied");
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
    //   log.debug("audio.suspend");
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

      log.debug("MediaSession.metadata = null");
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("stop", null);
      navigator.mediaSession.metadata = null;
    };
  }, [audio, player]);

  useEffect(() => {
    const track = player?.getCurrentTrack();
    if (!track) navigator.mediaSession.metadata = null;
    if (!playing || !player || !track) return;

    log.debug("Setting mediasession metadata");
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
    log.debug("mediaSession.metadata:", navigator.mediaSession.metadata);
    navigator.mediaSession.playbackState = "playing";

    log.debug("Setting action handlers...");
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
        log.debug("EV:", ev);
        player.seekBy((ev.seekOffset || 10) * -1);
        forceRender();
      }
    );
    navigator.mediaSession.setActionHandler(
      "seekforward",
      (ev: MediaSessionActionDetails) => {
        log.debug("EV:", ev);
        player.seekBy(ev.seekOffset || 10);
        forceRender();
      }
    );
    navigator.mediaSession.setActionHandler("seekto", (ev: MediaSessionActionDetails) => {
      log.debug("EV:", ev);
      if (ev.seekTime !== null && ev.seekTime !== undefined) player.seekTo(ev.seekTime);
      forceRender();
    });

    return () => {
      navigator.mediaSession.metadata = null;
    };
  }, [playing]);

  return { player };
};

export default usePlayer;
