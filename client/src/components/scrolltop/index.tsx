import { h } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";

import style from "./style.css";
import scrollIcon from "./icon.svg";

const ScrollTop = () => {
  const [visible, setVisible] = useState(false);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useLayoutEffect(() => {
    window.onscroll = () => setVisible(window.pageYOffset > window.innerHeight);

    return () => (window.onscroll = null);
  }, []);

  return (
    <div class={`${style.scrolltop} ${visible ? style.visible : ""}`} onClick={scrollTop}>
      <img src={scrollIcon} />
      <div>
        Back <br /> to top
      </div>
    </div>
  );
};

export default ScrollTop;
