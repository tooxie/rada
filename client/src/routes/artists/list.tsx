import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import style from "./style.css";
import Spinner from "../../components/spinner";
import { Artist } from "../../graphql/api";
import { useListArtists } from "./hooks";
import { listArtists } from "./graphql";

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
  console.log(`ArtistList (${typeof ArtistList})`);
  const { loading, error, artists } = listArtists();
  // const { loading, error, artists } = useListArtists();
  console.log("ArtistList.useListArtists:");
  console.log({ loading, error, artists });
  if (error) console.error(error);

  if (loading) {
    return <Spinner />;
  } else {
    if (error) return <p>{error}</p>;
    if (!artists) return <p>No Artists</p>;
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
