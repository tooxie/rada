import { h } from "preact";
import { Link } from "preact-router/match";

import style from "./style.css";

interface MenuProps {
  hideControls?: boolean;
  isAdmin?: boolean;
}

const Menu = ({ hideControls, isAdmin }: MenuProps) => {
  if (hideControls) return null;

  return (
    <section class={style.collections}>
{/*
      <Link href="/favorites" activeClassName={style.active}>
        Favs
      </Link>
*/}
      <Link href="/artists" activeClassName={style.active}>
        Artists
      </Link>
      <Link href="/albums" activeClassName={style.active}>
        Albums
      </Link>
{/*
      <Link href="/playlists" activeClassName={style.active}>
        Playlists
      </Link>
*/}
      {isAdmin && (
        <Link href="/invitations" activeClassName={style.active}>
          Invitations
        </Link>
      )}
    </section>
  );
};

export default Menu;
