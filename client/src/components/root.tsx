import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import Queue from "../routes/queue";
import usePlayer from "../player/hooks/useplayer";

import PlayerCtx from "./player/context";
import Shoulder from "./layout/shoulder";
import Header from "./header";
import Router from "./router";
import Player from "./player";

import style from "./app.css";

const Root = () => {
  const { player } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);

  if (!player)
    return (
      <Fragment>
        <Header />
        <Shoulder>
          <div style={{ padding: "1rem 0 3rem" }}>Loading...</div>
        </Shoulder>
      </Fragment>
    );

  return (
    <div id="preact_root" key="preact_root" class={style.root}>
      <PlayerCtx.Provider value={player}>
        <Router />
        <Player onClick={() => setShowQueue(true)} />
        {/*
          If I don't wrap the Queue component with a div I get the error:
          TypeError: Cannot read properties of null (reading 'type')
              at getPreviousSibling (async.js?7a7b:8:1)
              at getPreviousSibling (async.js?7a7b:19:1)
              at AsyncComponent.render (async.js?7a7b:48:1)
          This is the @preact/async-loader package. Is this a preact bug?
         */}
        <div>
          <Queue
            player={player}
            visible={showQueue}
            onClick={() => setShowQueue(false)}
          />
        </div>
      </PlayerCtx.Provider>
    </div>
  );
};

export default Root;
