import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import Spinner from "../../components/spinner";
import { Artist } from "../../graphql/api";
import compareName from "../../utils/comparename";

import useListArtists from "./hooks/uselistartists";
import style from "./list.css";

const DEFAULT_ARTIST_IMAGE = "/assets/img/default-artist-image.jpeg";
const ArtistThumb: FunctionComponent<Artist> = (props) => {
  const image = props.imageUrl || DEFAULT_ARTIST_IMAGE;

  if (!props.id) throw new Error("Invalid artist");

  return (
    <Link href={"/artist/" + props.id.split(":")[1]}>
      <div class={style.artist}>
        <img src={image} loading="lazy" />
        <div class={style.name}>{props.name}</div>
      </div>
    </Link>
  );
};

const ArtistList: FunctionComponent = () => {
  console.log(`ArtistList (${typeof ArtistList})`);
  const { loading, error, artists } = useListArtists();
  console.log("ArtistList.useListArtists:");
  console.log({ loading, error, artists });
  if (error) console.error(error);

  if (loading) {
    return <Spinner />;
  } else {
    if (error) return <p>{error.message}</p>;
    if (!artists || artists.length < 1) return <p>No Artists</p>;
  }

  const _artists = artists.map((el) => el).sort(compareName);

  return (
    <div class={style.artistgrid}>
      {_artists.map((artist: Artist) => (
        <ArtistThumb key={artist.id} {...artist} />
      ))}
    </div>
  );
};

export default ArtistList;
