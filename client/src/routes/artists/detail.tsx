import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";

import style from "./style.css";
import useGetArtist from "./hooks/usegetartist";

// https://thenounproject.com/term/cd-cover/2032601/
const DEFAULT_ALBUM_COVER = "/assets/img/default-album-cover.svg";
const ArtistDetail: FunctionComponent<DetailProps> = ({ id }) => {
  const { loading, error, artist } = useGetArtist(id);

  console.log(`loading: ${loading}`);
  console.log(`error: "${error}"`);
  if (loading) {
    return (
      <div class={style.spinner}>
        <Spinner />
      </div>
    );
  } else if (!artist) {
    return error ? <p>{error}</p> : <p>Artist not found</p>;
  }

  const albums = artist.albums?.items || [];

  return (
    <div class={style.artist}>
      <h1 class={style.name}>{artist.name}</h1>
      <div class={style.albums}>
        {albums.map(album => (
          <div class={style.album}>
            <Link href={`/albums/${album.id}`}>
              <img src={album.coverUrl || DEFAULT_ALBUM_COVER} />
              <h2>{album.title}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;
