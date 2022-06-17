import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/types";
import Navigation from "../../components/navigation";
import Logger from "../../logger";

import useGetArtist from "./hooks/usegetartist";
import style from "./header.css";

const log = new Logger(__filename);

let currentArtist: string | null = null;
const defaultBackground = "/assets/img/black.png";
let backgroundImage = `url(${defaultBackground})`;

const Header: FunctionComponent<DetailProps> = ({ id, serverId }) => {
  log.debug(`artists.Header("${id}", "${serverId}")`);
  const { artist } = useGetArtist(serverId, id);

  if (currentArtist != id) backgroundImage = `url(${defaultBackground})`;
  if (artist) backgroundImage = `url("${artist?.imageUrl || defaultBackground}")`;
  currentArtist = id;

  return (
    <div class={style.gradient} key="header-gradient">
      <header key="header" class={style.header} style={{ backgroundImage }}>
        <Navigation isDetail={true} />
      </header>
    </div>
  );
};

export default Header;
