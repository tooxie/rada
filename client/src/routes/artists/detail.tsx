import { FunctionComponent, h } from "preact";
import { Link } from "preact-router";

import Options from "../../components/options";
import { DetailProps } from "../../components/layout/detail/types";
import Spinner from "../../components/spinner";
import compareYear from "../../utils/compareyear";
import { urlize } from "../../utils/id";
import { Album } from "../../graphql/api";

import style from "./detail.css";
import useGetArtist from "./hooks/usegetartist";

// Credit: https://www.reddit.com/r/pics/comments/1okjo8/youve_come_to_the_wrong_neighborhood/
const DEFAULT_ALBUM_COVER = "/assets/img/default-album-cover.jpeg";
const ArtistDetail: FunctionComponent<DetailProps> = (props) => {
  const { loading, error, artist } = useGetArtist(props.id);

  if (loading) {
    return (
      <div class={style.spinner}>
        <Spinner />
      </div>
    );
  } else {
    if (!artist) {
      return <p class={style.error}>{error ? error.message : "Artist not found"}</p>;
    }
  }

  const albums = (artist.albums || []).map((el) => el).sort(compareYear);
  const bgImg = (a: Album) => `url("${a.imageUrl || DEFAULT_ALBUM_COVER}")`;

  return (
    <div key={`detail-${props.id}`}>
      <div class={style.name}>
        <h1>{artist.name}</h1>
        <Options />
      </div>
      <div class={style.albums}>
        {albums.map((album) => (
          <div class={style.album} key={album.id}>
            <Link href={`/album/${urlize(album.id)}`}>
              <div class={style.thumb} style={{ backgroundImage: bgImg(album) }} />
              <h2>{album.name}</h2>
              <h3 class={style.year}>{album.year}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;
