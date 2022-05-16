import { h, Fragment } from "preact";
import StatusAlert from "react-status-alert";
import "react-status-alert/dist/status-alert.css";

import Queue from "../routes/queue";
import usePlayer from "../player/hooks/useplayer";
import useAppState from "../state/hooks/useappstate";

import PlayerCtx from "./player/context";
import Shoulder from "./layout/shoulder";
import Header from "./header";
import Router from "./router";
import Player from "./player";

import style from "./app.css";

const Root = () => {
  const { player } = usePlayer();
  const { appState, dispatch, actions } = useAppState();

  const openQueue = () => dispatch(actions.OpenQueue);
  const closeQueue = () => dispatch(actions.CloseQueue);

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
      <StatusAlert />
      <PlayerCtx.Provider value={player}>
        <Router />
        <Player onClick={openQueue} />
        <Queue player={player} visible={appState.isQueueOpen} onDismiss={closeQueue} />
      </PlayerCtx.Provider>
    </div>
  );
};

export default Root;
