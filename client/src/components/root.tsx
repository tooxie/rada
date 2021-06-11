import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import { Track } from "../graphql/api";
import usePlayer from "../player/hooks/useplayer";

import Shoulder from "./layout/shoulder";
import Player from "./player/context";
import Header from "./header";
import Router from "./router";

import style from "./app.css";

const AppRoot = () => {
  const { player } = usePlayer();
  const [track, setTrack] = useState<Track>();

  if (!player)
    return (
      <Fragment>
        <Header />
        <Shoulder>
          <div style={{ paddingTop: "1rem" }}>Loading...</div>
        </Shoulder>
      </Fragment>
    );

  const _track = player.getCurrentTrack();

  if ((!track && _track) || track?.id !== _track?.id) {
    if (_track) setTrack(_track);
  }

  return (
    <div id="preact_root" key="preact_root" class={style.root}>
      <Player.Provider value={player}>
        <Router />
      </Player.Provider>
    </div>
  );
};

export default AppRoot;
