import { Fragment, FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import { Album, Artist } from "../../graphql/api";
import { urlize } from "../../utils/id";
import Search from "../../components/search";
import Spinner from "../../components/spinner";
import ScrollTop from "../../components/scrolltop";
import useConf from "../../hooks/useconf";

import style from "./list.css";
import useListAlbums from "./hooks/uselistalbums";

const DEFAULT_ALBUM_COVER = "/assets/img/no-cover.jpeg";

interface AlbumThumbProps {
  album: Album;
  artists?: Artist[];
}

const AlbumThumb: FunctionComponent<AlbumThumbProps> = ({ album }) => {
  const bgUrl = `url("${album.imageUrl || DEFAULT_ALBUM_COVER}")`;
  const artists = (album.artists || []).map((a) => a.name);

  return (
    <Link key={album.id} href={`/album/${urlize(album.id)}`} class={style.album}>
      <div class={style.cover} style={{ backgroundImage: bgUrl }} />
      <div class={style.artistname}>{album.isVa ? "V/A" : artists.join(", ")}</div>
      <div class={style.name}>{album.name}</div>
    </Link>
  );
};

const AlbumList = () => {
  const { loading, error, albums } = useListAlbums();
  const { conf } = useConf();
  const filterFn = (album: Album, s: string) => {
    const name = (album.name || "").toLowerCase();
    return name.includes(s.toLowerCase());
  };

  if (error) return <p class={style.empty}>{error.message}</p>;
  if (loading) return <Spinner />;

  if (!albums || albums.length < 1) return <p class={style.empty}>No Albums</p>;

  const _albums = albums.map((el) => el).sort(compareAlbumNames);

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
          <div class={style.albumgrid}>
            {result.map((album: Album) => (
              <AlbumThumb key={album.id} album={album} />
            ))}
          </div>
          <ScrollTop />
        </Fragment>
      )}
    </Search>
  );
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
