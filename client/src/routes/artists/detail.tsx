import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";
import compareYear from "../../utils/compareyear";
import { urlize } from "../../utils/id";

import style from "./detail.css";
import useGetArtist from "./hooks/usegetartist";
import useGetAlbumsForArtist from "./hooks/usegetalbumsforartist";

// https://thenounproject.com/term/cd-cover/2032601/
const DEFAULT_ALBUM_COVER = "/assets/img/default-album-cover.svg";
const ArtistDetail: FunctionComponent<DetailProps> = ({ id }) => {
  const { loading, error, artist } = useGetArtist(id);

  if (loading) {
    return (
      <div class={style.spinner}>
        <Spinner />
      </div>
    );
  }
  if (!artist) {
    return error ? <p>{error.message}</p> : <p>Artist not found</p>;
  }

  const albums = (artist.albums || []).map((el) => el).sort(compareYear);

  return (
    <div class={style.artist} key={id}>
      <h1 class={style.name}>{artist.name}</h1>
      <div class={style.albums}>
        {albums.map((album) => (
          <div class={style.album} key={album.id}>
            <Link href={`/album/${urlize(album.id)}`}>
              <img src={album.imageUrl || DEFAULT_ALBUM_COVER} />
              <h2>{album.name}</h2>
              <h3 class={style.year}>{album.year}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const getAlbums = (artistId: string) => {
  console.log(`getAlbums(${JSON.stringify(artistId)})`);
  const { loading, error, albums } = useGetAlbumsForArtist(artistId);

  return { loading, error, albums };
};

export default ArtistDetail;
