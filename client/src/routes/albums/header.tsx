import { h } from "preact";

import { DetailProps } from "../../components/layout/types";
import Navigation from "../../components/navigation";
import { Album } from "../../graphql/api";
import Logger from "../../logger";

import useGetAlbum from "./hooks/usegetalbumforheader";
import style from "./header.css";
import PlayAlbum from "./play";

type EmptyHeaderProps = Omit<DetailProps, "id" | "serverId">;

const log = new Logger(__filename);

const defaultBackground = "/assets/img/black.png";
let backgroundImage = `url(${defaultBackground})`;
let _album: Album | null = null;

const Header = (props: DetailProps) => {
  if (props.serverId && props.id) return AlbumHeader(props);
  else return EmptyHeader(props);
};

const EmptyHeader = (props: EmptyHeaderProps) => {
  const clickHandler = (ev: Event) => {
    ev.stopPropagation();
    if (props.onClick) props.onClick(ev);
  };

  return (
    <header
      key="header"
      class={style.header}
      style={{ backgroundImage: `url(${defaultBackground})` }}
      onClick={clickHandler}
    >
      {!props.hideNav && <Navigation isDetail={true} />}
      {props.children}
    </header>
  );
};

const AlbumHeader = (props: DetailProps) => {
  log.debug(`Albums.Header("${props.serverId}", "${props.id}")`);
  const { album } = useGetAlbum(props.serverId, props.id);
  const clickHandler = (ev: Event) => {
    ev.stopPropagation();
    if (props.onClick) props.onClick(ev);
  };

  if (!_album || _album.id !== props.id) _album = album;
  const playable = Boolean((_album?.tracks || []).length > 0);
  backgroundImage = `url("${_album?.imageUrl || defaultBackground}")`;

  return (
    <header
      key="header"
      class={style.header}
      style={{ backgroundImage }}
      onClick={clickHandler}
    >
      {!props.hideNav && <Navigation isDetail={true} />}
      {playable && !props.hidePlayButton && (
        <PlayAlbum albumId={props.id} serverId={props.serverId} />
      )}
      {props.children}
    </header>
  );
};

export default Header;
