import { h } from "preact";

import style from "./style.css";
import scrollIcon from "./icon.svg";

const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
const ScrollTop = () => {
  return (
    <div class={style.wrapper}>
      <div class={style.scrolltop} onClick={scrollTop}>
        <img src={scrollIcon} />
        <div>
          Back
          <br />
          to top
        </div>
      </div>
    </div>
  );
};

export default ScrollTop;
