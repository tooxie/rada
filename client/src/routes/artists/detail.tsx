import { Fragment, FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import { DetailProps } from "../../components/layout/detail/types";
import ErrorMsg from "../../components/error";
import Spinner from "../../components/spinner";
import compareYear from "../../utils/compareyear";
import { urlize } from "../../utils/id";
import { Album, Artist } from "../../graphql/api";
import { ArtistId } from "../../types";

import style from "./detail.css";
import useGetArtist from "./hooks/usegetartist";

let _artist: Artist | null = null;

const DEFAULT_ALBUM_COVER = "/assets/img/no-cover.jpeg";
const ArtistDetail: FunctionComponent<DetailProps> = ({ id }) => {
  const { loading, error, artist } = useGetArtist(id as ArtistId);

  if (id !== _artist?.id) _artist = null;
  if (!loading && artist) _artist = artist;

  if (error) return <ErrorMsg error={error} margins={true} />;
  if (!loading && !artist) return <p class={style.empty}>Artist not found</p>;
  if (!_artist) {
    return (
      <Fragment>
        <div class={style.name}>
          <h1>&nbsp;</h1>
        </div>
        <div class={style.spinner}>
          <Spinner />
        </div>
      </Fragment>
    );
  }

  const albums = (_artist.albums || []).map((el) => el).sort(compareYear);
  const bgImg = (a: Album) => `url("${a.imageUrl || DEFAULT_ALBUM_COVER}")`;

  return (
    <div key={`detail-${id}`}>
      <div class={style.name}>
        <h1>{_artist.name}</h1>
      </div>
      <div class={style.albums}>
        {albums.length === 0 && <p>No albums</p>}
        {albums.map((album) => (
          <div class={style.album} key={album.id}>
            <Link href={`/album/${urlize(album.id)}`}>
              <div class={style.thumb} style={{ backgroundImage: bgImg(album) }} />
              <div class={style.sub}>
                {!!album.year && <h3 class={style.year}>{album.year}</h3>}
                {(album.artists || []).length > 1 && <h3 class={style.va}>V/A</h3>}
              </div>
              <h2 class={style.albumname}>{album.name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;
