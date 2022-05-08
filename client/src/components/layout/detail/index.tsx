import { Fragment, FunctionComponent, h } from "preact";

import { AlbumId, TrackId } from "../../../types";
import DefaultHeader from "../../header";
import Player from "../../player";
import Shoulder from "../shoulder";
import usePlayer from "../../../hooks/useplayer";

import { DetailProps } from "./types";

const Detail = (
  Component: FunctionComponent<DetailProps>,
  HeaderComponent?: FunctionComponent<DetailProps>
) => {
  const Header = HeaderComponent || DefaultHeader;

  return (props: DetailProps) => {
    const player = usePlayer();
    if (!player) return <div />;

    const track = player.getCurrentTrack();
    const getEntity = () => window.location.pathname.split("/")[1];
    const getId = (props: DetailProps): any => `${getEntity()}:${props.id}`;

    return (
      <Fragment>
        {!!track && (
          <Player
            key="player"
            trackId={track.id as TrackId}
            albumId={track.album.id as AlbumId}
          />
        )}
        <Header key={`detail-header-${props.id}`} id={getId(props)} />
        <Shoulder key={`detail-shoulder-${props.id}`} detail={true}>
          <Component {...props} id={getId(props)} />
        </Shoulder>
      </Fragment>
    );
  };
};

export default Detail;
