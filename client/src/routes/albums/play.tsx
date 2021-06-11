import { h } from "preact";
import { route } from "preact-router";

import type { AlbumId, ServerId } from "../../types";

import style from "./play.css";
import playIcon from "../../assets/icons/svg/play.svg";
import useGetAlbum from "./hooks/usegetalbum";
import usePlayer from "../../hooks/useplayer";
import { byVolume, hasUrl } from "./utils/tracks";

interface PlayAlbumProps {
  albumId: AlbumId;
  serverId: ServerId;
}

const PlayAlbum = ({ albumId, serverId }: PlayAlbumProps) => {
  const player = usePlayer();
  const { album } = useGetAlbum(serverId, albumId);

  const clickHandler = () => {
    if (!album || !player) return;
    const tracks = (album.tracks || []).filter(hasUrl).sort(byVolume);
    if (tracks.length < 1) return;

    player.replaceQueue(tracks);
    player.play();
  };

  return (
    <div class={`${album ? style.play : style.none}`} onClick={clickHandler}>
      <img src={playIcon} />
    </div>
  );
};

export default PlayAlbum;
