import { FunctionComponent, h } from "preact";
import { Link } from "preact-router/match";

import { DetailProps } from "../../components/layout/detail/types";

import Navigation from "../navigation";
import style from "./style.css";

const Header: FunctionComponent<Partial<DetailProps>> = () => {
  return (
    <header class={style.header}>
      <Navigation />
      <section class={style.collections}>
        <Link href="/artists" activeClassName={style.active}>
          Artists
        </Link>
        <Link href="/albums/" activeClassName={style.active}>
          Albums
        </Link>
        <Link href="/playlists" activeClassName={style.active}>
          Playlists
        </Link>
      </section>
    </header>
  );
};

export default Header;
