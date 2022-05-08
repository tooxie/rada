import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import Queue from "../routes/queue";
import usePlayer from "../player/hooks/useplayer";

import PlayerCtx from "./player/context";
import Shoulder from "./layout/shoulder";
import Header from "./header";
import Router from "./router";

import style from "./app.css";
import Player from "./player";

const AppRoot = () => {
  const { player } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  const track = player?.getCurrentTrack();

  if (!player)
    return (
      <Fragment>
        <Header />
        <Shoulder>
          <div style={{ paddingTop: "1rem" }}>Loading...</div>
        </Shoulder>
      </Fragment>
    );

  return (
    <div id="preact_root" key="preact_root" class={style.root}>
      <PlayerCtx.Provider value={player}>
        <Router />
        {track && (
          <Player
            trackId={track.id}
            albumId={track.album.id}
            onClick={() => setShowQueue(true)}
          />
        )}
        <Queue player={player} visible={showQueue} onClick={() => setShowQueue(false)} />
      </PlayerCtx.Provider>
    </div>
  );
};

export default AppRoot;
