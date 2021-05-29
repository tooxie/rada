import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";
import { useState, useEffect } from "preact/hooks";

import { Album } from "../../graphql/api";
import Spinner from "../../components/spinner";
import style from "./style.css";
import { getAlbums } from "./graphql";

const DEFAULT_ALBUM_COVER = "/assets/icons/svg/music_note.svg";

const AlbumThumb: FunctionComponent<Album> = props => {
  const cover = props.coverUrl || DEFAULT_ALBUM_COVER;

  return (
    <Link href={"/albums/" + props.id}>
      <div class={style.album}>
        <img src={cover} />
        <div class={style.artist}>{props.artists}</div>
        <div class={style.name}>{props.title}</div>
      </div>
    </Link>
  );
};

const AlbumList: FunctionComponent = () => {
  const [albums, setAlbums] = useState([] as Album[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      getAlbums().then(data => {
        setAlbums(data);
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

  return (
    <div class={style.albumgrid}>
      {albums.map(album => (
        <AlbumThumb {...album} />
      ))}
    </div>
  );
};

export default AlbumList;
