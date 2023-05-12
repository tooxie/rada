import { h } from "preact";

import type { AlbumId, ServerId } from "../../types";
import type { Album, Track } from "../../graphql/api";
import type { IPlayer } from "../../player/types";

import useGetAlbum from "../../routes/albums/hooks/usegetalbum";
import usePlayer from "../../hooks/useplayer";
import Logger from "../../logger";

import style from "./style.css";
import icon from "./queue.svg";
import playIcon from "./play.svg";
import pauseIcon from "./pause.svg";
import wifiIcon from "./wifi.svg";
import Countdown from "./countdown";

interface ShellProps {
  onClick: Function;
  track?: Track;
}

interface PlayerProps {
  onClick: Function;
  track: Track;
  player: IPlayer;
  album?: Album;
}

interface PlayerBackgroundProps {
  serverId: ServerId;
  albumId: AlbumId;
  children?: JSX.Element | JSX.Element[];
}

type NoBackgroundProps = Pick<PlayerBackgroundProps, "children">;

const log = new Logger(__filename);

const Shell = ({ onClick }: ShellProps) => {
  const player = usePlayer();
  const track = player?.getCurrentTrack();
  const emptyQ = (player?.getQueueLength() || 0) === 0;
  const visible = !!player && !!track && !emptyQ;

  return (
    <div class={`${style.shell} ${visible ? style.visible : style.hidden}`}>
      {player &&
        track &&
        (track.serverId && track.album?.id ? (
          <PlayerBackground serverId={track.serverId} albumId={track.album?.id}>
            <Player player={player} track={track} onClick={onClick} />
          </PlayerBackground>
        ) : (
          <NoBackground>
            <Player player={player} track={track} onClick={onClick} />
          </NoBackground>
        ))}
    </div>
  );
};

const defaultBackground = "/assets/img/black.png";
let backgroundImage = `url(${defaultBackground})`;
let _album: Album | null = null;

const PlayerBackground = ({ serverId, albumId, children }: PlayerBackgroundProps) => {
  const { album } = useGetAlbum(serverId, albumId);
  const albumChanged = _album?.id !== albumId;

  if (albumChanged) _album = album;
  if (_album) backgroundImage = `url(${_album.imageUrl || defaultBackground})`;

  return (
    <div key="player-background" class={style.background} style={{ backgroundImage }}>
      {children}
    </div>
  );
};

const NoBackground = ({ children }: NoBackgroundProps) => (
  <div key="player-background" class={style.background}>
    {children}
  </div>
);

const Player = ({ player, track, onClick }: PlayerProps) => {
  log.debug(`Player.render(${track.id})`);

  const title = player.getCurrentTrack()?.title;
  const artists = player.getCurrentTrack()?.artists || [];
  const notify = () => (onClick ? onClick() : null);
  const clickHandler = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
    player.togglePlayback();
  };

  return (
    <div key="player-background" class={style.player} onClick={notify}>
      <div class={style.song2}>
        <div class={style.icon}>
          <img src={icon} />
        </div>
        <div class={style.info}>
          <div class={style.title} key={`player-title`}>
            {title || <span class={style.missing}>{"<no title>"}</span>}
          </div>
          <div class={style.artist} key={`player-artist`}>
            {artists.map((a) => a.name).join(", ")}
            &nbsp;
          </div>
        </div>
        <div class={style.controls} onClick={clickHandler}>
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
      </div>
    </div>
  );
};

export default Shell;
