import { FunctionComponent, h } from "preact";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";

import style from "./style.css";
import useGetArtist from "./hooks/usegetartist";

const Header: FunctionComponent<DetailProps> = ({ id }) => {
  const { error, artist } = useGetArtist(id);
  // if (loading || !artist) return <div />;

  // console.log("loading:", loading);
  const backgroundImage = artist?.imageUrl ? `url(${artist.imageUrl})` : "none";
  // console.log(backgroundImage);
  if (error) console.error(error);

  return (
    <header class={style.header} style={{ backgroundImage }}>
      <Navigation />
    </header>
  );
};

export default Header;
