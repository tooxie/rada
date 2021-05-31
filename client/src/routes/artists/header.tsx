import { FunctionComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";
import { Artist } from "../../graphql/api";

import { getArtist } from "./graphql";
import style from "./style.css";

const Header: FunctionComponent<DetailProps> = ({ id }) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      getArtist(id)
        .then(artist => {
          setArtist(artist);
          setLoading(false);
        })
        .catch(setError);
    }
  });

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
