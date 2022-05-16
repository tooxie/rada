import { h } from "preact";

import useAppState from "../../state/hooks/useappstate";

import Navigation from "../navigation";
import Menu from "../menu";
import style from "./style.css";

interface HeaderProps {
  hideControls?: boolean;
  isDetail?: boolean;
}

const Header = (props: HeaderProps) => {
  const { appState } = useAppState();

  return (
    <header class={style.header}>
      <div class={style.song2} />
      <Navigation
        hideControls={props.hideControls}
        key="navigation"
        isDetail={props.isDetail}
      />
      <Menu hideControls={props.hideControls} isAdmin={appState.isAdmin} key="menu" />
    </header>
  );
};

export default Header;
