import { FunctionComponent, h } from "preact";
import { useEffect, useRef, useState, useMemo } from "preact/hooks";
import { memo } from "preact/compat";

import { DetailProps } from "../../components/layout/types";
import Navigation from "../../components/navigation";
import Logger from "../../logger";

import useGetArtist from "./hooks/usegetartist";
import style from "./header.css";

const log = new Logger(__filename);

const defaultBackground = "/assets/img/black.png";

const Header: FunctionComponent<DetailProps> = memo(({ id, serverId }) => {
  log.debug(`artists.Header("${id}", "${serverId}")`);
  const { artist } = useGetArtist(serverId, id);
  const prevIdRef = useRef<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(`url(${defaultBackground})`);

  useEffect(() => {
    if (prevIdRef.current !== id) {
      setBackgroundImage(`url(${defaultBackground})`);
      prevIdRef.current = id;
    }
    if (artist?.imageUrl) {
      setBackgroundImage(`url("${artist.imageUrl}")`);
    }
  }, [id, artist?.imageUrl]);

  const headerStyle = useMemo(() => ({ backgroundImage }), [backgroundImage]);

  return (
    <div class={style.gradient} key="header-gradient">
      <header key="header" class={style.header} style={headerStyle}>
        <Navigation isDetail={true} />
      </header>
    </div>
  );
});

export default Header;
