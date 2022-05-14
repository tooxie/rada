import { h } from "preact";

import useConf from "../../conf/hooks/useconf";

import Navigation from "../navigation";
import Menu from "../menu";
import style from "./style.css";

interface HeaderProps {
  hideControls?: boolean;
}

const Header = (props: HeaderProps) => {
  const { conf } = useConf();

  return (
    <header class={style.header}>
      <div class={style.song2} />
      <Navigation hideControls={props.hideControls} key="navigation" />
      <Menu hideControls={props.hideControls} isAdmin={conf.isAdmin} key="menu" />
    </header>
  );
};

export default Header;
