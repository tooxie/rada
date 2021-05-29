import { FunctionComponent, h } from "preact";
import { Link } from "preact-router/match";
import style from "./style.css";
import BackLink from "../backlink";

const Navigation: FunctionComponent = () => {
  return (
    <section class={style.navigation}>
      <div class={style.back}>
        <BackLink>
          <img src="/assets/icons/svg/arrow_left_previous-white.svg" />
        </BackLink>
      </div>

      <div class={style.title}>Gawshi</div>

      <div class={style.search}>
        <Link href="/search">
          <img src="/assets/icons/svg/search-white.svg" />
        </Link>
      </div>

      <div class={style.settings}>
        <Link href="/settings">
          <img src="/assets/icons/svg/options_parameters_preferences_settings-white.svg" />
        </Link>
      </div>
    </section>
  );
};

export default Navigation;
