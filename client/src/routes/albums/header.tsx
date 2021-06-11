import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./header.css";
import Play from "./play";

// Credit: https://www.reddit.com/r/pics/comments/1okjo8/youve_come_to_the_wrong_neighborhood/
const DEFAULT_ALBUM_COVER = "/assets/img/default-album-cover.jpeg";
const Header: FunctionComponent<DetailProps> = ({ id }) => {
  console.log(`albums.Header("${id}")`);
  const { album } = useGetAlbum(id);
  const bgImg = `url("${album?.imageUrl || DEFAULT_ALBUM_COVER}")`;

  return (
    <header
      class={album ? style.header : style.notfound}
      style={{ backgroundImage: bgImg }}
    >
      <Navigation />
      <Play />
    </header>
  );
};

export default Header;
