import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";
import { useState, useEffect } from "preact/hooks";

import { getAlbums } from "./graphql";
import { Album } from "../../graphql/api";
import Spinner from "../../components/spinner";
import style from "./style.css";

const DEFAULT_ALBUM_COVER = "/assets/icons/svg/music_note.svg";

interface AlbumsProps {
  id?: string;
}

const Albums: FunctionalComponent<AlbumsProps> = props => {
  const { id } = props;

  return id ? <AlbumDetail id={id} /> : <AlbumList />;
};

const AlbumDetail: FunctionalComponent<AlbumsProps> = props => {
  return <h1>{props.id}</h1>;
};

const AlbumThumb: FunctionalComponent<Album> = props => {
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

const AlbumList: FunctionalComponent = () => {
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

  if (loading) return <Spinner />;

  return (
    <div class={style.albumgrid}>
      {albums.map(album => (
        <AlbumThumb {...album} />
      ))}
    </div>
  );
};

export default Albums;
