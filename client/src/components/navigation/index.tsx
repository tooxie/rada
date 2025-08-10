import { h, FunctionComponent, Fragment } from "preact";
import { Link } from "preact-router/match";

import BackLink from "../backlink";
import useConf from "../../hooks/useconf";
import defaultServer from "../../config.json";

import back from "./back.svg";
import searchIn from "./search-in.svg";
import searchOut from "./search-out.svg";
import Servers from "./servers";
import Settings from "./settings";
import style from "./style.css";
import Logger from "../../logger";

const log = new Logger(__filename);

interface NavigationProps {
  hideControls?: boolean;
  isDetail?: boolean;
}

const Navigation: FunctionComponent<NavigationProps> = (props) => {
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

  const Title = () => {
    log.debug("currentServer", conf.currentServer);
    return (
      <div class={style.title}>
        <Link href={`/server/${conf.currentServer.id}/artists`} key={conf.currentServer.id}>
          {conf.currentServer.id !== defaultServer.server.id && "*"}
          {conf.currentServer.name}
        </Link>
      </div>
    );
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

          <Title />

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
