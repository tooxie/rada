import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";

import useGetAlbum from "./hooks/usegetalbum";
import style from "./style.css";

const Header: FunctionComponent<DetailProps> = ({ id }) => {
  const { album } = useGetAlbum(id);

  return (
    <header
      class={album ? style.header : style.notfound}
      style={{ backgroundImage: album?.coverUrl }}
    >
      <Navigation />
    </header>
  );
};

export default Header;
