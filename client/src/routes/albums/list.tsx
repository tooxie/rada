import { h, Fragment } from "preact";
import { Link } from "preact-router";

import type { ListProps } from "../../components/layout/types";
import type { Album, Artist } from "../../graphql/api";

import ErrorMsg from "../../components/error";
import Logger from "../../logger";
import ScrollTop from "../../components/scrolltop";
import Search from "../../components/search";
import Spinner from "../../components/spinner";
import useConf from "../../hooks/useconf";
import { AlbumListTypes } from "../../conf/types";
import { toHref } from "../../utils/id";

import style from "./list.css";
import listIcon from "./disc.svg";
import useListAlbums from "./hooks/uselistalbums";

const DEFAULT_ALBUM_COVER = "/assets/img/no-cover.jpeg";
const log = new Logger(__filename);

const AlbumList = ({ serverId }: ListProps) => {
  const { loading, error, albums } = useListAlbums(serverId);
  const { conf } = useConf();
  const filterFn = (album: Album, s: string) => {
    const name = (album.name || "").toLowerCase();
    return name.includes(s.toLowerCase());
  };

  if (error) {
    log.error(error);
    return <ErrorMsg error={error} />;
  }
  if (loading) return <Spinner />;
  if (albums.length === 0) {
    return <p>No Albums</p>;
  }

  return (
    <Search
      input={albums}
      key={`album-list-${serverId}`}
      noResultsClass={style.empty}
      filter={filterFn}
      enabled={conf.searchEnabled}
    >
      {(result: Album[]) => (
        <Fragment>
          {renderAs(conf.albumListType, result)}
          <ScrollTop />
        </Fragment>
      )}
    </Search>
  );
};

const renderAs = (listType: string, albums: Album[]): JSX.Element | JSX.Element[] => {
  switch (listType) {
    case AlbumListTypes.List: {
      return renderAsList(albums);
    }
    case AlbumListTypes.Grid: {
      return renderAsMosaic(albums);
    }
    case AlbumListTypes.Thumbnails: {
      return renderAsThumbnails(albums);
    }
    default: {
      return renderAsMosaic(albums);
    }
  }
};

const renderAsList = (albums: Album[]) => (
  <section class={style.list}>
    {albums.map((album) => (
      <Link class={style.album} href={toHref(album)} key={album.id}>
        <img src={listIcon} />
        <div>
          <div class={style.artist}>
            {album.isVa ? (
              "V/A"
            ) : (album.artists || []).length ? (
              (album.artists || []).map((artist) => artist.name).join(", ")
            ) : (
              <span class={style.missing}>{"<no artist>"}</span>
            )}
          </div>
          {renderName(album)}
        </div>
      </Link>
    ))}
  </section>
);

const renderAsMosaic = (albums: Album[]) => (
  <section class={style.mosaic}>
    {albums.map((album: Album) => (
      <Link class={style.album} href={toHref(album)} key={album.id}>
        <div
          class={style.cover}
          style={{ backgroundImage: `url("${album.imageUrl || DEFAULT_ALBUM_COVER}")` }}
        />
        <div class={style.artist}>
          {album.isVa ? (
            "V/A"
          ) : (album.artists || []).length ? (
            (album.artists || []).map((artist) => artist.name).join(", ")
          ) : (
            <span class={style.missing}>{"<no artist>"}</span>
          )}
        </div>
        {renderName(album)}
      </Link>
    ))}
  </section>
);

const renderAsThumbnails = (albums: Album[]) => (
  <section class={style.thumbnails}>
    {albums.map((album) => (
      <Link class={style.album} href={toHref(album)} key={album.id}>
        <div
          class={style.thumb}
          style={{ backgroundImage: `url("${album.imageUrl || DEFAULT_ALBUM_COVER}")` }}
        />
        <div class={style.details}>
          <div class={style.artist}>
            {album.isVa ? (
              "V/A"
            ) : (album.artists || []).length ? (
              (album.artists || []).map((artist) => artist.name).join(", ")
            ) : (
              <span class={style.missing}>{"<no artist>"}</span>
            )}
          </div>
          {renderName(album)}
        </div>
      </Link>
    ))}
  </section>
);

const renderName = (album: Album): JSX.Element => {
  const classes = [style.name, album.name ? "" : style.missing].join(" ");
  return <div class={classes}>{album.name || "<no title>"}</div>;
};

const compareAlbumNames = (album1: Album, album2: Album): -1 | 0 | 1 => {
  const byAlbumName = (album1: Album, album2: Album): -1 | 0 | 1 => {
    const name1 = (album1.name || "").toLowerCase();
    const name2 = (album2.name || "").toLowerCase();

    if (!name1 && name2) return -1;
    if (name1 && !name2) return 1;
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;

    return 0;
  };
  const getArtist = (a: Album): Artist | undefined => (a.artists || []).find((a) => !!a);
  const getName = (a?: Artist): string => (a ? a.name || "" : "");
  const byArtistName = (album1: Album, album2: Album): -1 | 0 | 1 => {
    const artist1 = getName(getArtist(album1)).toLowerCase();
    const artist2 = getName(getArtist(album2)).toLowerCase();

    if (artist1 < artist2) return -1;
    if (artist1 > artist2) return 1;

    return 0;
  };
  const byArtistCount = (album1: Album, album2: Album): -1 | 0 | 1 => {
    const l1 = (album1?.artists || []).length;
    const l2 = (album2?.artists || []).length;

    // If either of the albums is a V/A
    if (l1 > 1 && l2 === 1) return -1;
    if (l1 === 1 && l2 > 1) return 1;

    // Albums with no artists
    if (l1 === 0 && l2 > 0) return -1;
    if (l1 > 0 && l2 === 0) return 1;

    return 0;
  };

  let result: -1 | 0 | 1;

  result = byArtistCount(album1, album2);
  if (result !== 0) return result;
  result = byArtistName(album1, album2);
  if (result !== 0) return result;
  result = byAlbumName(album1, album2);
  if (result !== 0) return result;

  return 0;
};

export default AlbumList;
