import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./header.css";

const Header: FunctionComponent<DetailProps> = ({ id }) => {
  console.log(`albums.Header("${id}")`);
  const { album } = useGetAlbum(id);
  const bgImg = album?.imageUrl ? `url("${album.imageUrl}")` : "none";

  return (
    <header
      class={album ? style.header : style.notfound}
      style={{ backgroundImage: bgImg }}
    >
      <Navigation />
    </header>
  );
};

export default Header;
