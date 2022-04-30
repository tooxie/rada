import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";
import Logger from "../../logger";
import { ArtistId } from "../../types";

import useGetArtist from "./hooks/usegetartist";
import style from "./header.css";

const log = new Logger(__filename);

let currentArtist: string | null = null;
let backgroundImage = "url(none)";

const Header: FunctionComponent<DetailProps> = ({ id }) => {
  log.debug(`artists.Header("${id}")`);
  const { artist } = useGetArtist(id as ArtistId);

  if (currentArtist != id) backgroundImage = "url(none)";
  if (artist) backgroundImage = `url("${artist?.imageUrl || "none"}")`;
  currentArtist = id;

  return (
    <div class={style.gradient} key="header-gradient">
      <header key="header" class={style.header} style={{ backgroundImage }}>
        <Navigation />
      </header>
    </div>
  );
};

export default Header;
