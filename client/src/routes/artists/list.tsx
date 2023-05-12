import { h, Fragment } from "preact";
import { Link } from "preact-router";

import type { Artist } from "../../graphql/api";

import ErrorMsg from "../../components/error";
import Logger from "../../logger";
import ScrollTop from "../../components/scrolltop";
import Search from "../../components/search";
import Spinner from "../../components/spinner";
import useConf from "../../hooks/useconf";
import { ArtistListTypes } from "../../conf/types";
import { toHref } from "../../utils/id";

import useListArtists from "./hooks/uselistartists";
import listIcon from "./mic.svg";
import style from "./list.css";

const log = new Logger(__filename);

const ArtistList = () => {
  const { conf } = useConf();
  const { loading, error, artists } = useListArtists();

  if (error) {
    log.error(error);
    return <ErrorMsg error={error} />;
  }
  if (loading) return <Spinner />;
  if ((artists || []).length < 1) return <p>No Artists</p>;

  const filterFn = (artist: Artist, s: string): boolean => {
    const name = (artist.name || "").toLowerCase();
    return name.includes(s.toLowerCase());
  };

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
      <Link href={toHref(artist)} class={style.artist}>
        <img src={listIcon} /> {artist.name}
      </Link>
    ))}
  </section>
);

const renderAsMosaic = (artists: Artist[]) => (
  <section class={style.grid}>
    {artists.map((artist: Artist) => (
      <Link
        href={toHref(artist)}
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
      <Link href={toHref(artist)} class={style.artist}>
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
