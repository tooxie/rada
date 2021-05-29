import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";
import { useState, useEffect } from "preact/hooks";

import { getArtists } from "./graphql";
import style from "./style.css";
import Spinner from "../../components/spinner";
import { Artist } from "../../graphql/api";

const DEFAULT_ARTIST_IMAGE =
  "https://www.proaudioland.com/wp/wp-content/uploads/2017/01/generic-band-e1483736893335.jpg";

const ArtistThumb: FunctionComponent<Artist> = props => {
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

const ArtistList: FunctionComponent = () => {
  const [artists, setArtists] = useState([] as Artist[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      getArtists().then(data => {
        setArtists(data);
        setLoading(false);
      });
    }
  });

  if (loading) {
    return <Spinner />;
  } else {
    if (!artists.length) {
      return <p>No Artists</p>;
    }
  }

  return (
    <div class={style.artistgrid}>
      {artists.map((artist: Artist) => (
        <ArtistThumb {...artist} />
      ))}
    </div>
  );
};

export default ArtistList;
