import { h, Fragment } from "preact";
import { Link } from "preact-router";

import { Album } from "../../graphql/api";
import { toHref } from "../../utils/id";
import Search from "../../components/search";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import ScrollTop from "../../components/scrolltop";
import useConf from "../../hooks/useconf";

import style from "./list.css";
import listIcon from "./disc.svg";
import useListAlbums from "./hooks/uselistalbums";
import { AlbumListTypes } from "../../conf/types";
import { ListProps } from "../../components/layout/types";

const DEFAULT_ALBUM_COVER = "/assets/img/no-cover.jpeg";

const AlbumList = ({ serverId }: ListProps) => {
  const { loading, error, albums } = useListAlbums(serverId);
  const { conf } = useConf();
  const filterFn = (album: Album, s: string) => {
    const name = (album.name || "").toLowerCase();
    return name.includes(s.toLowerCase());
  };

  if (error) return <ErrorMsg error={error} />;
  if (loading) return <Spinner />;
  if (albums.length < 1) return <p>No Albums</p>;

  return (
    <Search
      input={albums}
      key="album-list"
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

export default AlbumList;
