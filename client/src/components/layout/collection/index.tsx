import { h, Fragment, FunctionComponent } from "preact";

import Player from "../../player";
import Header from "../../header";
import Shoulder from "../shoulder";
import { Track } from "../../../graphql/api";
import { AlbumId, TrackId } from "../../../types";
import usePlayer from "../../../hooks/useplayer";

let track: Track | null = null;

const Collection = (Component: FunctionComponent): FunctionComponent => {
  return (props) => {
    const player = usePlayer();
    const _track = player?.getCurrentTrack();

    if (!track || (_track && track.id !== _track.id)) {
      if (_track) track = _track;
    }

    return (
      <Fragment>
        <Header key="collection-header" />
        <Shoulder key="collection-shoulder">
          {/* <Queue.Consumer>{({queue}) => <div>{queue.length}</div>}</Queue.Consumer> */}
          <Component {...props} />
        </Shoulder>
        {!!track && (
          <Player
            key="player"
            trackId={track.id as TrackId}
            albumId={track.album.id as AlbumId}
          />
        )}
      </Fragment>
    );
  };
};

const _Collection: FunctionComponent = (props) => {
  const player = usePlayer();
  const _track = player?.getCurrentTrack();

  if (!track || (_track && track.id !== _track.id)) {
    if (_track) track = _track;
  }

  return (
    <Fragment>
      <Header key="collection-header" />
      <Shoulder key="collection-shoulder">{props.children}</Shoulder>
      {!!track && (
        <Player
          key="player"
          trackId={track.id as TrackId}
          albumId={track.album.id as AlbumId}
        />
      )}
    </Fragment>
  );
};

export default Collection;
