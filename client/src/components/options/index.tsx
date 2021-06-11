import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import style from "./style.css";
import dots from "./dots.svg";

const Modal = () => {
  const [visible, setVisible] = useState(false);
  const display = visible ? "block" : "none";

  return (
    <Fragment>
      <img src={dots} class={style.dots} onClick={() => setVisible(!visible)} />

      <div class={style.modal} style={{ display }} onClick={() => setVisible(!visible)}>
        Hola
      </div>
    </Fragment>
  );
};

export default Modal;
