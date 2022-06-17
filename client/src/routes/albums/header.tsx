import { h } from "preact";

import { DetailProps } from "../../components/layout/types";
import Navigation from "../../components/navigation";
import { Album } from "../../graphql/api";
import Logger from "../../logger";

import useGetAlbum from "./hooks/usegetalbumforheader";
import style from "./header.css";
import PlayAlbum from "./play";

const log = new Logger(__filename);

const defaultBackground = "/assets/img/black.png";
let backgroundImage = `url(${defaultBackground})`;
let _album: Album | null = null;

const Header = (props: DetailProps) => {
  log.debug(`Albums.Header("${props.serverId}", "${props.id}")`);
  const { album } = useGetAlbum(props.serverId, props.id);
  const clickHandler = (ev: Event) => {
    ev.stopPropagation();
    if (props.onClick) props.onClick(ev);
  };

  if (!_album || _album.id !== props.id) _album = album;

  backgroundImage = `url("${_album?.imageUrl || defaultBackground}")`;

  return (
    <header
      key="header"
      class={style.header}
      style={{ backgroundImage }}
      onClick={clickHandler}
    >
      {!props.hideNav && <Navigation isDetail={true} />}
      {_album && !props.hidePlayButton && (
        <PlayAlbum albumId={props.id} serverId={props.serverId} />
      )}
      {props.children}
    </header>
  );
};

export default Header;
