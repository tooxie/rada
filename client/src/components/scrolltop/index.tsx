import { h } from "preact";

import style from "./style.css";
import scrollIcon from "./icon.svg";

interface ScrollTopProps {
  container?: HTMLDivElement | null;
}

const ScrollTop = ({ container }: ScrollTopProps) => {
  const scrollTop = () => (container || window).scrollTo({ top: 0, behavior: "smooth" });

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
