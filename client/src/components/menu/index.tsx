import { h } from "preact";
import { Link } from "preact-router/match";

import useAppState from "../../state/hooks/useappstate";

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

interface ServerItemProps extends Exclude<ItemProps, "hidden"> {}
interface AdminItemProps extends Exclude<ItemProps, "hidden"> {
  admin?: boolean;
}

const Item = ({ href, name, hidden }: ItemProps) => {
  if (hidden) return null;

  const isActive = window.location.pathname.startsWith(href);

  return (
    <Link href={href} class={isActive ? style.active : ""}>
      {name}
    </Link>
  );
};

const AdminItem = ({ href, name, admin }: AdminItemProps) => (
  <Item href={href} name={name} hidden={!admin} />
);

const ServerItem = ({ href, name }: ServerItemProps) => {
  const { appState } = useAppState();
  const serverPath = appState.serverId ? `/server/${appState.serverId}` : "";

  return <Item href={`${serverPath}${href}`} name={name} />;
};

const Menu = ({ hideControls, isAdmin }: MenuProps) => {
  if (hideControls) return null;

  return (
    <nav class={style.menu}>
      <ServerItem href="/artists" name="Artists" />
      <ServerItem href="/albums" name="Albums" />
      <ServerItem href="/tracks" name="Tracks" />

      <AdminItem href="/friends" name="Friends" admin={isAdmin} />
      <AdminItem href="/servers" name="Servers" admin={isAdmin} />
    </nav>
  );
};

export default Menu;
