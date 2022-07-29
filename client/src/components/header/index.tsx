import { h } from "preact";

import useAppState from "../../state/hooks/useappstate";
import useConf from "../../conf/hooks/useconf";

import Navigation from "../navigation";
import Menu from "../menu";
import style from "./style.css";

interface HeaderProps {
  hideControls?: boolean;
  isDetail?: boolean;
}

const Header = (props: HeaderProps) => {
  const { appState } = useAppState();
  const { conf } = useConf();

  const backgroundImage = `url(${conf.currentServer.headerUrl})`;

  return (
    <header
      class={style.header}
      style={conf.currentServer.headerUrl ? { backgroundImage } : {}}
    >
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
