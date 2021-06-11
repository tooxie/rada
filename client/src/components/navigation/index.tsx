import { h, Fragment } from "preact";
import { Link } from "preact-router/match";

import BackLink from "../backlink";
import useConf from "../../hooks/useconf";

import style from "./style.css";
import back from "./back.svg";
import servers from "./servers.svg";
import searchIn from "./search-in.svg";
import searchOut from "./search-out.svg";
import Settings from "./settings";

interface NavigationProps {
  hideControls?: boolean;
}

const Navigation = (props: NavigationProps) => {
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
    <section class={style.navigation}>
      {props.hideControls ? (
        <Fragment>
          <div class={style.back}>
            <img src={back} />
          </div>

          <div class={style.title}>Gawshi</div>
        </Fragment>
      ) : (
        <Fragment>
          <div class={style.back}>
            <BackLink>
              <img src={back} />
            </BackLink>
          </div>

          <div class={style.title}>
            <Link href="/">Gawshi</Link>
          </div>

          {/* Only show if we have at least 1 server */}
          <div class={style.servers} onClick={() => alert("Servers!")}>
            <img src={servers} />
          </div>

          <div class={style.search}>
            <Link href="/search" onMouseDown={toggleSearch} onClick={noop}>
              <img src={conf.searchEnabled ? searchOut : searchIn} />
            </Link>
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
