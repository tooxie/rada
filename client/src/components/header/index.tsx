import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import Navigation from "../navigation";
import style from "./style.css";

const Header: FunctionalComponent = () => {
  return (
    <header class={style.header}>
      <Navigation />
      <section class={style.collections}>
        <div>
          <Link href="/artists" activeClassName={style.active}>
            Artists
          </Link>
        </div>
        <div>
          <Link href="/albums/" activeClassName={style.active}>
            Albums
          </Link>
        </div>
        <div>
          <Link href="/playlists" activeClassName={style.active}>
            Playlists
          </Link>
        </div>
      </section>
    </header>
  );
};

export default Header;
