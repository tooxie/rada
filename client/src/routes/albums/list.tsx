import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";
import { useState, useEffect } from "preact/hooks";

import { Album } from "../../graphql/api";
import Spinner from "../../components/spinner";
import { urlize } from "../../utils/id";
import compareName from "../../utils/comparename";

import style from "./list.css";
import { listAlbums } from "./graphql";

// https://thenounproject.com/term/cd-cover/2032601/
const DEFAULT_ALBUM_COVER = "/assets/img/default-album-cover.svg";

interface AlbumThumbProps {
  album: Album;
}

const AlbumThumb: FunctionComponent<AlbumThumbProps> = ({ album }) => {
  const cover = album.imageUrl || DEFAULT_ALBUM_COVER;

  return (
    <Link href={`/album/${urlize(album.id)}`} class={style.album}>
      <img src={cover} />
      <div class={style.name}>{album.name}</div>
      <div class={style.year}>{album.year}</div>
    </Link>
  );
};

const AlbumList: FunctionComponent = () => {
  const [albums, setAlbums] = useState([] as Album[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      listAlbums().then((albums) => {
        setAlbums(albums);
        setLoading(false);
      });
    }
  });

  if (loading) {
    return <Spinner />;
  } else {
    if (!albums.length) {
      return <p>No Albums</p>;
    }
  }

  const _albums = albums.map((el) => el).sort(compareName);

  return (
    <div class={style.albumgrid}>
      {_albums.map((album) => (
        <AlbumThumb key={album.id} album={album} />
      ))}
    </div>
  );
};

export default AlbumList;
