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
  if (hidden) return <div />;
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
    <section class={style.collections}>
      <Item href="/artists" name="Artists" />
      <Item href="/albums" name="Albums" />

      <AdminItem href="/invitations" name="Invitations" admin={isAdmin} />
    </section>
  );
};

export default Menu;
