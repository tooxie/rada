import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";
import { useState, useEffect } from "preact/hooks";

import style from "./style.css";
import { getArtists } from "./graphql";
import { Artist } from "../../graphql/api";
import Spinner from "../../components/spinner";

const DEFAULT_ARTIST_IMAGE =
  "https://www.proaudioland.com/wp/wp-content/uploads/2017/01/generic-band-e1483736893335.jpg";

interface ArtistsProps {
  id?: string;
}

const Artists: FunctionalComponent<ArtistsProps> = props => {
  const { id } = props;

  return id ? <ArtistDetail id={id} /> : <ArtistList />;
};

const ArtistDetail: FunctionalComponent<ArtistsProps> = props => {
  return <h1>{props.id}</h1>;
};

const ArtistThumb: FunctionalComponent<Artist> = props => {
  const image = props.imageUrl || DEFAULT_ARTIST_IMAGE;

  return (
    <Link href={"/artists/" + props.id}>
      <div class={style.artist}>
        <img src={image} />
        <div class={style.name}>{props.name}</div>
      </div>
    </Link>
  );
};

const ArtistList: FunctionalComponent = () => {
  const [artists, setArtists] = useState([] as Artist[]);

  useEffect(() => {
    if (!artists.length) {
      getArtists().then(data => setArtists(data));
    }
  });

  if (!artists.length) return <Spinner />;

  return (
    <div class={style.artistgrid}>
      {artists.map((artist: Artist) => (
        <ArtistThumb {...artist} />
      ))}
    </div>
  );
};

export default Artists;
