import { h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";
import { AlbumId } from "../../types";
import { Album } from "../../graphql/api";

import useGetAlbum from "./hooks/usegetalbumforheader";
import style from "./header.css";
import PlayAlbum from "./play";

let _album: Album | null = null;
let backgroundImage = "url(none)";

const Header = (props: DetailProps) => {
  console.log(`[albums/header.tsx] Loading album "${props.id}"`);
  const albumId = props.id as AlbumId;
  const { album } = useGetAlbum(albumId);

  if (!_album || _album.id !== props.id) _album = album;

  backgroundImage = `url("${_album?.imageUrl || "none"}")`;

  return (
    <header key="header" class={style.header} style={{ backgroundImage }}>
      <Navigation />
      {_album && !props.hidePlayButton && <PlayAlbum albumId={albumId} />}
      {props.children}
    </header>
  );
};

export default Header;
