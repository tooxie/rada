import { h } from "preact";

import { AlbumId } from "../../types";
import style from "./play.css";
import playIcon from "../../assets/icons/svg/play.svg";
import useGetAlbum from "./hooks/usegetalbum";
import usePlayer from "../../hooks/useplayer";

interface PlayAlbumProps {
  albumId: AlbumId;
}

const PlayAlbum = ({ albumId }: PlayAlbumProps) => {
  const player = usePlayer();
  const { album } = useGetAlbum(albumId as AlbumId);

  const clickHandler = () => {
    if (!album || !player) return;
    const tracks = album.tracks || [];
    if (tracks.length < 1) return;

    player.replaceQueue(tracks);
    player.play();

    // TODO: Show queue
  };

  return (
    <div class={`${album ? style.play : style.none}`} onClick={clickHandler}>
      <img src={playIcon} />
    </div>
  );
};

export default PlayAlbum;
