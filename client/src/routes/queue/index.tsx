import { h, Fragment } from "preact";
import { useEffect } from "preact/hooks";
import { Link, route } from "preact-router";

import Header from "../albums/header";
import Shoulder from "../../components/layout/shoulder";
import toMinutes from "../../utils/tominutes";
import { urlize } from "../../utils/id";
import { AlbumId } from "../../types";
import { Artist, Track } from "../../graphql/api";
import usePlayer from "../../hooks/useplayer";
import ScrollTop from "../../components/scrolltop";
import Logger from "../../logger";

import clearQueueIcon from "./delete_list_playlist_remove.svg";
import style from "./style.css";
import playBigIcon from "./play-big.svg";
import loadingIcon from "./wifi.svg";
import playSmallIcon from "./play-small.svg";
import pauseIcon from "./pause.svg";
import Timer from "./timer";
import Vinyl from "./vinyl";

const log = new Logger(__filename);

const Queue = () => {
  log.debug(`Queue.render()`);
  const player = usePlayer();
  log.debug("queue: ", player?.getQueue());
  if (!player) return <div />;
  if (player.getQueueLength() === 0) route("/artists");
  const { queue } = player;

  // If you scroll down in the artists page, for example, and then click on the
  // player to go to the queue, it won't reset the scroll position, so we have
  // to force it ¯\_(ツ)_/¯
  useEffect(() => window.scrollTo(0, 0), []);

  const trackClickHandler = (index: number) => player.skipTo(index);
  const togglePlayback = (event: Event) => {
    log.debug(`togglePlayback()`);
    player.togglePlayback();
    event.stopPropagation();
    event.preventDefault();
  };
  const clearQueue = () => {
    player.clearQueue();
    window.history.back();
  };
  const toUrl = (id: string) => id.split(":").join("/");
  const track = player.getCurrentTrack();
  if (!track) return <div />;
  log.debug(`Current index at ${player.getIndex()}`);
  log.debug(`Current track is "${track.title}"`);
  let prevArtist: string;
  let prevAlbum: string;

  const renderTrackList = (track: Track, index: number) => {
    const getArtistName = (track: Track) =>
      (track.artists || []).map((a) => a.name).join(", ");
    const getFeatures = (track: Track) => (track.features || []).join(", ");
    let currArtist = !!track.album.isVa ? "V/A" : getArtistName(track);
    let currAlbum = track.album.name || "";
    let artistChanged = currArtist !== prevArtist;
    let albumChanged = currAlbum !== prevAlbum;
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

    const trackJsx = (
      <Fragment>
        {artistChanged || albumChanged ? (
          <div class={style.header}>
            {/* TODO: Handle missing artist/album */}
            <span class={style.artists}>{currArtist}</span>/
            <span class={style.album}>{currAlbum}</span>
          </div>
        ) : (
          ""
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
            <div class={style.sub}>
              {track.album.isVa ? getArtistName(track) : ""}
              {track.features ? ` ft. ${getFeatures(track)}` : ""}
            </div>
          </div>
          <div class={style.rm} onClick={rmTrack(index)}>
            &#215;
          </div>
        </div>
      </Fragment>
    );
    prevArtist = currArtist;
    prevAlbum = currAlbum;

    return trackJsx;
  };

  const qLength = queue.getTracks().length;
  const qDuration = queue.getDuration();

  return (
    <Fragment key="queue">
      <Header key="queue-header" id={track.album.id as AlbumId} hidePlayButton={true}>
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
            <Link href={`/${toUrl(track.album.id)}/${toUrl(track.id)}`}>
              {track.title ? (
                track.title
              ) : (
                <span class={style.missing}>&lt;no title&gt;</span>
              )}
            </Link>
          </div>
          <div class={style.artists}>
            {/* Small hack to preserve the height of the element while the track loads */}
            {track?.artists ? "" : <div>&nbsp;</div>}
            {renderArtistLinks(track?.artists || [])}
          </div>
          <div class={style.album}>
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <Link href={`/album/${urlize(track.album.id)}`}>{track.album.name}</Link>
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

        <div class={style.scrolltop}>
          <ScrollTop />
        </div>
      </Shoulder>
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
