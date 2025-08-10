import { h, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import StatusAlert from "react-status-alert";
import "react-status-alert/dist/status-alert.css";

import Queue from "../routes/queue";
import usePlayer from "../player/hooks/useplayer";
import useAppState from "../state/hooks/useappstate";

import PlayerCtx from "./player/context";
import Shoulder from "./layout/shoulder";
import Spinner from "./spinner";
import Header from "./header";
import Router from "./router";
import Player from "./player";

import style from "./app.css";

const PlayerSurface = () => {
  const { player } = usePlayer();
  const { appState, dispatch, actions } = useAppState();

  const openQueue = useCallback(() => dispatch(actions.OpenQueue), [dispatch, actions]);
  const closeQueue = useCallback(() => dispatch(actions.CloseQueue), [dispatch, actions]);

  if (!player) {
    return (
      <Fragment>
        <Header />
        <Shoulder>
          <Spinner />
        </Shoulder>
      </Fragment>
    );
  }

  return (
    <PlayerCtx.Provider value={player}>
      <Router />
      <Player onClick={openQueue} />
      <Queue player={player} visible={appState.isQueueOpen} onDismiss={closeQueue} />
    </PlayerCtx.Provider>
  );
};

const Root = () => {
  return (
    <div id="preact_root" key="preact_root" class={style.root}>
      <StatusAlert />
      <PlayerSurface />
    </div>
  );
};

export default Root;
