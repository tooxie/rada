import { h } from "preact";
import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";

import Logger from "../../logger";

const log = new Logger(__filename);

interface Artwork {
  src?: string | null;
  type?: string | null;
}

interface MediaSessionProps {
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  artwork?: Artwork | null;

  onPlay?: (ev: MediaSessionActionDetails) => void;
  onPause?: (ev: MediaSessionActionDetails) => void;
  onStop?: (ev: MediaSessionActionDetails) => void;
  onSeekBackward?: (ev: MediaSessionActionDetails) => void;
  onSeekForward?: (ev: MediaSessionActionDetails) => void;
  onSeekTo?: (ev: MediaSessionActionDetails) => void;
  onPreviousTrack?: (ev: MediaSessionActionDetails) => void;
  onNextTrack?: (ev: MediaSessionActionDetails) => void;
}

const MediaSession = (props: MediaSessionProps) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    mediaSession.metadata = new MediaMetadata({
      title: props.title || "N/A",
      artist: props.artist || "N/A",
      album: props.album || "N/A",
      artwork: [
        {
          src: props.artwork?.src || "",
          type: props.artwork?.type || "",
        },
      ],
    });
    log.debug("mediaSession.metadata", mediaSession.metadata);

    return () => {
      log.debug("MediaSession.metadata = null");
      mediaSession.metadata = null;
    };
  }, [props.title, props.artist, props.album, props.artwork]);

  // onPlay
  useEffect(() => {
    if (props.onPlay) {
      mediaSession.setActionHandler("play", props.onPlay);
    }

    return () => mediaSession.setActionHandler("play", null);
  }, [props.onPlay]);

  // onPause
  useEffect(() => {
    if (props.onPause) {
      mediaSession.setActionHandler("pause", props.onPause);
    }

    return () => mediaSession.setActionHandler("pause", null);
  }, [props.onPause]);

  // onStop
  useEffect(() => {
    if (props.onStop) {
      mediaSession.setActionHandler("stop", props.onStop);
    }

    return () => mediaSession.setActionHandler("stop", null);
  }, [props.onStop]);

  // onSeekBackward
  useEffect(() => {
    if (props.onSeekBackward) {
      mediaSession.setActionHandler("seekbackward", props.onSeekBackward);
    }

    return () => mediaSession.setActionHandler("seekbackward", null);
  }, [props.onSeekBackward]);

  // onSeekForward
  useEffect(() => {
    if (props.onSeekForward) {
      mediaSession.setActionHandler("seekforward", props.onSeekForward);
    }

    return () => mediaSession.setActionHandler("seekforward", null);
  }, [props.onSeekForward]);

  // onSeekTo
  useEffect(() => {
    if (props.onSeekTo) {
      mediaSession.setActionHandler("seekto", props.onSeekTo);
    }

    return () => mediaSession.setActionHandler("seekto", null);
  }, [props.onSeekTo]);

  // onPreviousTrack
  useEffect(() => {
    if (props.onPreviousTrack) {
      mediaSession.setActionHandler("previoustrack", props.onPreviousTrack);
    }

    return () => mediaSession.setActionHandler("previoustrack", null);
  }, [props.onPreviousTrack]);

  // onNextTrack
  useEffect(() => {
    if (props.onNextTrack) {
      mediaSession.setActionHandler("nexttrack", props.onNextTrack);
    }

    return () => mediaSession.setActionHandler("nexttrack", null);
  }, [props.onNextTrack]);

  return <div key="media-session" />;
};

export default memo(
  MediaSession,
  (prev, next) =>
    prev.artist === next.artist && prev.album === next.album && prev.title === next.title
);
