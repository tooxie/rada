import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";

import style from "./header.css";
import useGetArtist from "./hooks/usegetartist";

const DEFAULT_ARTIST_IMAGE = "/assets/img/default-artist-image.jpeg";
const Header: FunctionComponent<DetailProps> = ({ id }) => {
  const { loading, error, artist } = useGetArtist(id);

  let backgroundImage: string = "none";
  if (!loading) {
    backgroundImage = `url("${artist?.imageUrl || DEFAULT_ARTIST_IMAGE}")`;
  }
  if (error) console.error(error);

  return (
    <header key={id} class={style.header} style={{ backgroundImage }}>
      <Navigation />
    </header>
  );
};

export default Header;
