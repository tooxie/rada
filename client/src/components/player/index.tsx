import { h } from "preact";
import { Link } from "preact-router";

import { Album } from "../../graphql/api";
import { AlbumId, TrackId } from "../../types";
import useGetAlbum from "../../routes/albums/hooks/usegetalbum";
import usePlayer from "../../hooks/useplayer";
import Logger from "../../logger";

import style from "./style.css";
import icon from "./playlist.svg";
import playIcon from "./play.svg";
import pauseIcon from "./pause.svg";
import wifiIcon from "./wifi.svg";
import Countdown from "./countdown";

const log = new Logger(__filename);

interface PlayerProps {
  trackId: TrackId;
  albumId: AlbumId;
}

let backgroundImage = "url(none)";
let _album: Album | null = null;

const Player = (props: PlayerProps) => {
  log.debug(`Player.render(${JSON.stringify(props)})`);
  const { album } = useGetAlbum(props.albumId);
  const albumChanged = _album?.id !== props.albumId;
  const player = usePlayer();

  if (!player || player.getQueueLength() === 0) return <div />;
  if (albumChanged) _album = album;
  if (_album) backgroundImage = `url(${_album.imageUrl || "none"})`;

  // const dispatch = (event: Event, eventName: string) => {
  //   doNothing(event);
  // };
  // const doNothing = (event: Event) => {
  //   event.stopPropagation();
  //   event.preventDefault();
  // };

  const clickHandler = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
    player.togglePlayback();
  };
  const title = player.getCurrentTrack()?.title;
  const artists = player.getCurrentTrack()?.artists || [];

  return (
    <div
      key="player-background"
      class={style.player}
      style={{ backgroundImage }}
      /*
       * Think about using touchStart instead of click. It speeds up reaction
       * times immensely, but if may lead to some subtle usability issues that
       * should be understood before.
       * onTouchStart={(ev) => {
       *   route("/queue");
       * }}
       */
    >
      <Link href={"/queue"}>
        <div class={style.icon}>
          <img src={icon} />
        </div>
        <div class={style.info}>
          <div class={style.title} key={`player-title`}>
            {title || <span class={style.missing}>&lt;no title&gt;</span>}
          </div>
          <div class={style.artist} key={`player-artist`}>
            {artists.map((a) => a.name).join(", ")}
            &nbsp;
          </div>
        </div>
        <div
          class={style.controls}
          onClick={clickHandler}
          /* onTouchStart={(ev) => dispatch(ev, playing ? "pause" : "play")} */
        >
          <div class={style.button}>
            <img
              src={
                player.isLoading() ? wifiIcon : player.isPlaying() ? pauseIcon : playIcon
              }
            />
          </div>
          <div class={style.remaining}>
            <Countdown
              current={player.getCurrentTime()}
              total={player.getCurrentTrack()?.lengthInSeconds}
              playing={player.isPlaying()}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Player;
