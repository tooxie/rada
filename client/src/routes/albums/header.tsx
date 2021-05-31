import { FunctionComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";
import { Album } from "../../graphql/api";

import { getAlbum } from "./graphql";
import style from "./style.css";

const Header: FunctionComponent<DetailProps> = ({ id }) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      getAlbum(id).then((album: Album | null) => {
        setAlbum(album);
        setLoading(false);
      });
    }
  });

  return (
    <header class={album ? style.header : style.notfound}>
      <Navigation />
    </header>
  );
};

export default Header;
