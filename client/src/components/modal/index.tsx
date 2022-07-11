import { h, Fragment, ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";

import Title from "./title";
import style from "./style.css";

interface ModalProps {
  visible: boolean;
  title?: ComponentChildren;
  children: ComponentChildren;
  onClick: (ev?: MouseEvent) => void;
}

const Modal = ({ title, children, visible, onClick }: ModalProps) => {
  const [display, setDisplay] = useState(false);
  const [showing, setShowing] = useState(false);
  const body = document.body;

  const displayStyle = display ? {} : { display: "none" };
  const classes = [style.overlay, showing ? style.visible : ""].join(" ");

  const hide = () => {
    body.classList.remove(style.noscroll);
    setShowing(false);
    setTimeout(() => setDisplay(false), 250);
  };

  const show = () => {
    body.classList.add(style.noscroll);
    setDisplay(true);
  };

  const clickHandler = (ev: MouseEvent) => onClick(ev);

  useEffect(() => {
    visible ? show() : hide();
  }, [visible]);

  useEffect(() => {
    if (display) setShowing(true);
  }, [display]);

  return (
    <div class={classes} style={displayStyle} onClick={clickHandler}>
      &nbsp;
      <div class={style.modal}>
        {title ? <Title>{title}</Title> : null}

        <Fragment>{children}</Fragment>
      </div>
    </div>
  );
};

export default Modal;
