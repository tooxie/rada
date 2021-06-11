import { Fragment, FunctionComponent, h } from "preact";

import Options from "../../components/options";
import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";
import { Track } from "../../graphql/api";
import compareOrdinal from "../../utils/compareordinal";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./detail.css";

const AlbumDetail: FunctionComponent<DetailProps> = ({ id }) => {
  const { loading, error, album } = useGetAlbum(id);

  if (loading) {
    return (
      <div class={style.spinner}>
        <Spinner />
      </div>
    );
  } else if (!album) {
    return error ? <p>{error.message}</p> : <p>Album not found</p>;
  }

  const tracks = (album.tracks || []).map((el) => el).sort(compareOrdinal);
  console.log(tracks);

  // TODO: Problems:
  // * The `updateOrCreateAlbum` resolver is duplicating the albums:
  //     It takes care of not duplicating the artist/album entry, but then it always
  //     creates a new album/album entry with the `input`
  // * The resolvers need some cleaning up, that appsync.tf file is getting a bit messy
  // * The album list should use hooks the same way the artist list does
  // * Other than that... lookin' good!!! :) :)

  return (
    <Fragment>
      <div class={style.name}>
        <h1>{album.name}</h1>
        <Options />
      </div>
      <div class={style.tracklist}>
        {/* <h2>Tracklist</h2> */}
        {tracks.map(renderTrack)}
      </div>
    </Fragment>
  );
};

const renderTrack = (track: Track) => (
  <div class={style.track}>
    <div class={style.ordinal}>{track.ordinal}</div>
    <div class={style.title}>
      <div>{track.title}</div>
      <div class={style.length}>{toMinutes(track.lengthInSeconds)}</div>
    </div>
    {/* <Options /> */}
  </div>
);

const toMinutes = (s?: number | null): string => (s ? "0:57" : "");

export default AlbumDetail;
