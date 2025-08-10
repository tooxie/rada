import { h, FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { DetailProps } from "../../components/layout/types";
import Navigation from "../../components/navigation";
import { Album } from "../../graphql/api";
import Logger from "../../logger";

import useGetAlbum from "./hooks/usegetalbumforheader";
import style from "./header.css";
import PlayAlbum from "./play";

type EmptyHeaderProps = Omit<DetailProps, "id" | "serverId">;

const log = new Logger(__filename);

const defaultBackground = "/assets/img/gray.png";

const Header: FunctionComponent<DetailProps> = (props) => {
  if (props.serverId && props.id) return AlbumHeader(props);
  else return EmptyHeader(props);
};

const EmptyHeader: FunctionComponent<EmptyHeaderProps> = (props) => {
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

const AlbumHeader: FunctionComponent<DetailProps> = (props) => {
  log.debug(`Albums.Header("${props.serverId}", "${props.id}")`);
  const { album } = useGetAlbum(props.serverId, props.id);
  const [playable, setPlayable] = useState(false);

  const clickHandler = (ev: Event) => {
    ev.stopPropagation();
    if (props.onClick) props.onClick(ev);
  };

  useEffect(() => setPlayable(Boolean((album?.tracks || []).length > 0)), [album]);

  return (
    <header
      key="header"
      class={style.header}
      style={{backgroundImage: `url("${album?.imageUrl || defaultBackground}")`}}
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
