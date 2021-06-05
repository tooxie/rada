import { Fragment, FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./style.css";

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

  const tracks = album.tracks?.items || [];

  return (
    <Fragment>
      <h1>{album.name}</h1>
      <div class={style.tracklist}>
        {tracks.map((track) => (
          <h2>{track.title}</h2>
        ))}
      </div>
    </Fragment>
  );
};

export default AlbumDetail;
