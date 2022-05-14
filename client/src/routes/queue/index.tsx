import { h, Fragment } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { Link } from "preact-router";

import type { IPlayer } from "../../player/types";

import Header from "../albums/header";
import Shoulder from "../../components/layout/shoulder";
import toMinutes from "../../utils/tominutes";
import { urlize } from "../../utils/id";
import { AlbumId } from "../../types";
import { Artist, Track } from "../../graphql/api";
import Logger from "../../logger";

import clearQueueIcon from "./delete_list_playlist_remove.svg";
import style from "./style.css";
import playSmallIcon from "./play-small.svg";
import Timer from "./timer";
import Vinyl from "./vinyl";

const log = new Logger(__filename);
let wasVisible: boolean;

interface QueueProps {
  player: IPlayer;
  visible: boolean;
  onClick: (ev?: Event) => void;
}

const Queue = ({ player, visible, onClick }: QueueProps) => {
  log.debug(`Queue.render()`);
  const { queue } = player;
  const ref = useRef<HTMLDivElement>(null);
  const [removeAnimation, setRemoveAnimation] = useState(true);

  const preventBodyScroll = () => document.body.classList.add(style.noscroll);
  const enableBodyScroll = () => document.body.classList.remove(style.noscroll);

  // In mobile, when you click on the search and the keyboard is displayed, the
  // viewport height changes. When you dismiss the keyboard the queue had adapted
  // to the new page height and it will show up where the keyboard used to be and
  // transition off the screen. That's why we need to remove the transition when
  // the queue is hidden.
  const decideWhatToDoAboutTheAnimation = () => {
    if (wasVisible !== visible) {
      if (visible) setRemoveAnimation(false);
      else setTimeout(() => setRemoveAnimation(true), 500);
    }
  };

  useEffect(() => {
    if (visible) preventBodyScroll();
    else enableBodyScroll();
    decideWhatToDoAboutTheAnimation();

    if (ref.current) ref.current.scrollTo({ top: 0 });
    wasVisible = visible;

    return () => enableBodyScroll();
  }, [visible]);

  const trackClickHandler = (index: number) => player.skipTo(index);
  const clearQueue = (ev: Event) => {
    player.pause();
    onClick();
    ev.stopPropagation();
    setTimeout(() => player.clearQueue(), 250);
  };
  const toUrl = (id: string) => id.split(":").join("/");
  const track = player.getCurrentTrack();
  if (!track) return <div />;
  log.debug(`Current index at ${player.getIndex()}`);
  log.debug(`Current track is "${track.title}"`);
  let prevTrack: Track | undefined;
  const getArtistName = (track?: Track): string | null =>
    (track?.artists || []).map((a) => a.name).join(", ");

  const renderTrackList = (track: Track, index: number) => {
    const getFeatures = (track: Track) => (track.features || []).join(", ");
    const artistName = track.album.isVa ? "V/A" : getArtistName(track);
    const albumName = track.album.name;
    let artistChanged = artistName !== getArtistName(prevTrack);
    let albumChanged = track.album.id !== prevTrack?.album.id;
    const isCurrentTrack = queue.getIndex() === index;
    const trackClasses = style.track + (isCurrentTrack ? ` ${style.current}` : "");
    const clickHandler = isCurrentTrack ? undefined : () => trackClickHandler(index);
    const rmTrack = (index: number): ((ev: Event) => void) => {
      return (ev: Event) => {
        player.removeTrackAt(index);
        ev.preventDefault();
        ev.stopPropagation();
      };
    };
    // If the album is V/A then we ignore the artist because it will obviously
    // be different for every track.
    const showHeader = track.album.isVa ? albumChanged : artistChanged || albumChanged;

    const trackJsx = (
      <Fragment>
        {showHeader && (
          <div class={style.header}>
            <span class={artistName ? style.artists : style.missing}>
              {artistName || "<no artist>"}
            </span>
            &nbsp;
            <span class={albumName ? style.album : style.missing}>
              {albumName || "<no album>"}
            </span>
          </div>
        )}
        <div key={`q-track-${index}`} class={trackClasses} onClick={clickHandler}>
          <div class={style.index}>
            {isCurrentTrack ? (
              player.isLoading() ? (
                <div class={style.hideIndex}>
                  {index + 1}.<div class={style.loader}>&nbsp;</div>
                </div>
              ) : player.isPlaying() ? (
                <div class={style.playing}>
                  <img src={playSmallIcon} />
                </div>
              ) : (
                `${index + 1}.`
              )
            ) : (
              `${index + 1}.`
            )}
          </div>
          <div class={style.title}>
            {track.title ? (
              track.title
            ) : (
              <span class={style.missing}>&lt;no title&gt;</span>
            )}
            <span class={style.sub}>
              {track.album.isVa ? getArtistName(track) : ""}
              {track.features ? ` ft. ${getFeatures(track)}` : ""}
            </span>
          </div>
          <div class={style.rm} onClick={rmTrack(index)}>
            &#215;
          </div>
        </div>
      </Fragment>
    );
    prevTrack = track;

    return trackJsx;
  };

  const qLength = queue.getTracks().length;
  const qDuration = queue.getDuration();

  return (
    <Fragment>
      <div class={`${style.modal} ${visible ? style.visible : ""}`} />

      <section
        ref={ref}
        class={[
          style.queue,
          visible ? style.visible : style.hidden,
          removeAnimation ? style.noanim : "",
        ].join(" ")}
      >
        <Header
          key="queue-header"
          id={track.album.id as AlbumId}
          hidePlayButton={true}
          hideNav={true}
          onClick={() => (onClick ? onClick() : null)}
        >
          <Vinyl
            onPlay={() => player.play()}
            onPause={() => player.pause()}
            isPlaying={player.isPlaying()}
            isLoading={player.isLoading()}
            totalTime={player.getCurrentTrack()?.lengthInSeconds || 0}
            currentTime={player.getCurrentTime()}
          />
        </Header>

        <Shoulder key="queue-shoulder" detail={true} noPadding={true}>
          <section class={style.timer}>
            <div class={style.remaining}>
              <Timer
                current={player?.getCurrentTime()}
                total={track.lengthInSeconds}
                playing={player?.isPlaying()}
              />
            </div>
            <div class={style.total}>{toMinutes(track.lengthInSeconds)}</div>
          </section>

          <section class={style.details}>
            <div class={style.title}>
              <Link
                href={`/${toUrl(track.album.id)}/${toUrl(track.id)}`}
                onClick={onClick}
              >
                {track.title ? (
                  track.title
                ) : (
                  <span class={style.missing}>&lt;no title&gt;</span>
                )}
              </Link>
            </div>
            <div class={style.artists} onClick={onClick}>
              {renderArtistLinks(track?.artists || [])}
            </div>
            <div class={style.album}>
              <Link href={`/album/${urlize(track.album.id)}`} onClick={onClick}>
                {track.album.name}
              </Link>
              &nbsp;
            </div>
          </section>

          <section class={style.tracklist}>
            <div class={style.heading}>
              <h2>
                Queue | {qLength} tracks | {toMinutes(qDuration)}
              </h2>
              <div class={style.clearQueueIcon} onClick={clearQueue}>
                <img src={clearQueueIcon} />
              </div>
            </div>
            {queue.getTracks().map(renderTrackList)}
          </section>
        </Shoulder>
      </section>
    </Fragment>
  );
};

const renderArtistLinks = (artists: Artist[]) => {
  const artistJsx = artists.map((artist: Artist) => (
    <Link href={`/artist/${urlize(artist.id)}`}>{artist.name}</Link>
  ));
  if (artistJsx.length < 2) return artistJsx;

  let commaSeparatedList: JSX.Element[] = [];
  for (let x = 0; x <= artistJsx.length; x++) {
    const artist = artistJsx[x];
    const isEven = x % 2 === 0;
    if (!isEven) {
      commaSeparatedList = commaSeparatedList.concat(<span>, </span>);
    }
    commaSeparatedList = commaSeparatedList.concat(artist);
  }

  return commaSeparatedList;
};

export default Queue;
