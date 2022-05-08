import { h, FunctionComponent, Fragment } from "preact";
import { Link } from "preact-router";

import { urlize } from "../../utils/id";
import { Artist } from "../../graphql/api";
import Spinner from "../../components/spinner";
import Search from "../../components/search";
import ScrollTop from "../../components/scrolltop";
import useConf from "../../hooks/useconf";
import { ArtistListTypes } from "../../conf/types";

import useListArtists from "./hooks/uselistartists";
import listIcon from "./mic.svg";
import style from "./list.css";

const ArtistList = () => {
  const { conf } = useConf();
  const { loading, error, artists } = useListArtists();
  const filterFn = (artist: Artist, s: string): boolean => {
    const name = (artist.name || "").toLowerCase();
    return name.includes(s.toLowerCase());
  };

  if (error) return <p class={style.empty}>{error.message}</p>;
  if (loading) return <Spinner />;
  if ((artists || []).length < 1) return <p class={style.empty}>No Artists</p>;

  return (
    <Search
      input={artists}
      key="artist-list"
      noResultsClass={style.empty}
      filter={filterFn}
      enabled={conf.searchEnabled}
    >
      {(result: Artist[]) => (
        <Fragment>
          {renderAs(conf.artistListType, result)}
          <ScrollTop />
        </Fragment>
      )}
    </Search>
  );
};

const renderAs = (listType: string, artists: Artist[]): JSX.Element | JSX.Element[] => {
  switch (listType) {
    case ArtistListTypes.List: {
      return renderAsList(artists);
    }
    case ArtistListTypes.Mosaic: {
      return renderAsMosaic(artists);
    }
    case ArtistListTypes.Thumbnails: {
      return renderAsThumbnails(artists);
    }
    default: {
      return renderAsMosaic(artists);
    }
  }
};

const renderAsList = (artists: Artist[]) => (
  <section class={style.list}>
    {artists.map((artist: Artist) => (
      <Link href={`/artist/${urlize(artist.id)}`} class={style.artist}>
        <img src={listIcon} /> {artist.name}
      </Link>
    ))}
  </section>
);

const renderAsMosaic = (artists: Artist[]) => (
  <section class={style.grid}>
    {artists.map((artist: Artist) => (
      <Link
        href={`/artist/${urlize(artist.id)}`}
        style={{ backgroundImage: `url(${artist.imageUrl || "none"})` }}
      >
        <div class={style.artist}>
          <img src={artist.imageUrl || ""} loading="lazy" />
          <div class={style.name}>{artist.name}</div>
        </div>
      </Link>
    ))}
  </section>
);

const renderAsThumbnails = (artists: Artist[]) => (
  <section class={style.thumbnails}>
    {artists.map((artist: Artist) => (
      <Link href={`/artist/${urlize(artist.id)}`} class={style.artist}>
        <div
          class={style.thumb}
          style={{ backgroundImage: `url(${artist.imageUrl || listIcon})` }}
        />
        <div class={style.name}>{artist.name}</div>
      </Link>
    ))}
  </section>
);

export default ArtistList;
