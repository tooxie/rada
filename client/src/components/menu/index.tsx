import { h } from "preact";
import { Link } from "preact-router/match";

import style from "./style.css";

interface MenuProps {
  hideControls?: boolean;
  isAdmin?: boolean;
}

interface ItemProps {
  href: string;
  name: string;
  hidden?: boolean;
}

interface AdminItemProps extends Exclude<ItemProps, "hidden"> {
  admin?: boolean;
}

const Item = ({ href, name, hidden }: ItemProps) => {
  if (hidden) return null;
  return (
    <Link href={href} activeClassName={style.active}>
      {name}
    </Link>
  );
};

const AdminItem = ({ href, name, admin }: AdminItemProps) => (
  <Item href={href} name={name} hidden={!admin} />
);

const Menu = ({ hideControls, isAdmin }: MenuProps) => {
  if (hideControls) return null;

  return (
    <nav class={style.menu}>
      <Item href="/artists" name="Artists" />
      <Item href="/albums" name="Albums" />
      <Item href="/tracks" name="Tracks" />

      <AdminItem href="/friends" name="Friends" admin={isAdmin} />
    </nav>
  );
};

export default Menu;
