import { h, FunctionComponent, Fragment } from "preact";
import { Link } from "preact-router";

import { Artist } from "../../graphql/api";
import Spinner from "../../components/spinner";
import Search from "../../components/search";
import ScrollTop from "../../components/scrolltop";
import useConf from "../../hooks/useconf";

import useListArtists from "./hooks/uselistartists";
import style from "./list.css";

const ArtistThumb: FunctionComponent<Artist> = ({ id, name, imageUrl }) => {
  const image = imageUrl || "none";

  return (
    <Link
      href={"/artist/" + id.split(":")[1]}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div class={style.artist}>
        <img src={image} loading="lazy" />
        <div class={style.name}>{name}</div>
      </div>
    </Link>
  );
};

let _artists: Artist[] = [];

const ArtistList = () => {
  const { conf } = useConf();
  const { loading, error, artists } = useListArtists();
  const filterFn = (artist: Artist, s: string): boolean => {
    const name = (artist?.name || "").toLowerCase();
    return name.includes(s.toLowerCase());
  };

  if (!_artists.length) _artists = artists;

  if (error) return <p class={style.empty}>{error.message}</p>;
  if (loading) return <Spinner />;

  if (!_artists || _artists.length < 1) {
    return <p class={style.empty}>No Artists</p>;
  }

  return (
    <Search
      input={_artists}
      key="artist-list"
      noResultsClass={style.empty}
      filter={filterFn}
      enabled={conf.searchEnabled}
    >
      {(result: Artist[]) => (
        <Fragment>
          <div class={style.artistgrid}>
            {result.map((artist: Artist) => (
              <ArtistThumb key={artist.id} {...artist} />
            ))}
          </div>
          <ScrollTop />
        </Fragment>
      )}
    </Search>
  );
};

export default ArtistList;
