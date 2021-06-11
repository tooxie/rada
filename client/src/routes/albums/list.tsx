import { Fragment, FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import { Album } from "../../graphql/api";
import Spinner from "../../components/spinner";
import { urlize } from "../../utils/id";
import compareName from "../../utils/comparename";

import style from "./list.css";
import useListAlbums from "./hooks/uselistalbums";

// // https://thenounproject.com/term/cd-cover/2032601/
// const DEFAULT_ALBUM_COVER = "/assets/img/default-album-cover.svg";
const DEFAULT_ALBUM_COVER =
  "https://sadanduseless.b-cdn.net/wp-content/uploads/2018/11/animal-band-album-cover1.jpg";

interface AlbumThumbProps {
  album: Album;
}

const AlbumThumb: FunctionComponent<AlbumThumbProps> = ({ album }) => {
  const bgUrl = `url("${album.imageUrl || DEFAULT_ALBUM_COVER}")`;

  return (
    <Link href={`/album/${urlize(album.id)}`} class={style.album}>
      <div class={style.cover} style={{ backgroundImage: bgUrl }} />
      <div class={style.name}>{album.name}</div>
      <div class={style.year}>{album.year}</div>
    </Link>
  );
};

const AlbumList: FunctionComponent = () => {
  const { loading, error, albums } = useListAlbums();

  if (loading) {
    return <Spinner />;
  } else {
    if (error) return <p>{error.message}</p>;
    if (!albums || albums.length < 1) return <p class={style.empty}>No Albums</p>;
  }

  const _albums = albums.map((el) => el).sort(compareName);

  return (
    <Fragment>
      <h1 class={style.artistname}>Bad Religion</h1>
      <div class={style.albumgrid}>
        {_albums.map((album) => (
          <AlbumThumb key={album.id} album={album} />
        ))}
      </div>
      <h1>Lagwagon</h1>
    </Fragment>
  );
};

export default AlbumList;
