import { h, Fragment } from "preact";
import { Link } from "preact-router/match";

import BackLink from "../backlink";
import useConf from "../../hooks/useconf";
import useAppState from "../../hooks/useappstate";

import back from "./back.svg";
import searchIn from "./search-in.svg";
import searchOut from "./search-out.svg";
import Servers from "./servers";
import Settings from "./settings";
import style from "./style.css";

interface NavigationProps {
  hideControls?: boolean;
  isDetail?: boolean;
}

const Navigation = (props: NavigationProps) => {
  const { appState } = useAppState();
  const { conf, setConf } = useConf();
  const noop = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  const toggleSearch = (ev: Event) => {
    conf.searchEnabled = !conf.searchEnabled;
    setConf(conf);
    ev.preventDefault();
    ev.stopPropagation();
  };

  return (
    <section
      class={`${style.navigation} ${props.isDetail ? style.detail : style.collection}`}
    >
      {props.hideControls ? (
        <Fragment />
      ) : (
        <Fragment>
          <BackLink class={style.back}>
            <img src={back} />
          </BackLink>

          <div class={style.title}>
            <Link href={`/server/${appState.serverId}/artists`}>
              {conf.currentServer.name}
            </Link>
          </div>

          {/* Only show if we have at least 1 server */}
          <div class={style.servers}>
            <Servers />
          </div>

          <div class={style.search}>
            <img
              src={conf.searchEnabled ? searchOut : searchIn}
              onMouseDown={toggleSearch}
              onClick={noop}
            />
          </div>

          <div class={style.settings}>
            <Settings />
          </div>
        </Fragment>
      )}
    </section>
  );
};

export default Navigation;
