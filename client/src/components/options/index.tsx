import { h, Fragment, ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";

import style from "./style.css";
import dots from "./dots.svg";

interface OptionsProps {
  icon?: string;
  title?: ComponentChildren;
  children: ComponentChildren;
}

const Options = ({ title, icon, children }: OptionsProps) => {
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(false);
  const body = document.body;

  const clickHandler = (ev: MouseEvent) => {
    ev.stopPropagation();
    if (visible) {
      setVisible(false);
      setTimeout(() => setDisplay(false), 250);
    } else {
      setDisplay(true);
      setTimeout(() => setVisible(true), 0);
    }
  };

  useEffect(() => {
    if (visible) body.classList.add(style.noscroll);
    else body.classList.remove(style.noscroll);

    return () => body.classList.remove(style.noscroll);
  }, [visible]);

  return (
    <Fragment>
      <img src={icon || dots} class={style.trigger} onClick={clickHandler} />

      <div
        class={`${style.overlay} ${visible ? style.visible : ""}`}
        style={display ? {} : { display: "none" }}
        onClick={clickHandler}
      >
        &nbsp;
        <div class={style.modal}>
          {title}
          <div class={style.body}>{children}</div>
        </div>
      </div>
    </Fragment>
  );
};

interface ActionProps {
  on?: (() => void) | ((ev: Event) => void);
  noop?: boolean;
  children: ComponentChildren;
}

const Action = (props: ActionProps) => {
  const handler = (ev: Event) => {
    if (props.noop) ev.stopPropagation();
    if (props.on) props.on(ev);
  };

  return (
    <div class={style.action} onClick={handler}>
      {props.children}
    </div>
  );
};

interface TitleProps {
  children: ComponentChildren;
}

const Title = (props: TitleProps) => {
  return <div class={style.title}>{props.children}</div>;
};

interface StepProps {
  on: () => void;
  next: (contentSetter: Function) => void;
  children: ComponentChildren;
}

const Step = ({ on, next, children }: StepProps) => {
  const [content, setContent] = useState<ComponentChildren>(children);
  const handler = (ev: Event) => {
    on();
    ev.stopPropagation();
    ev.preventDefault();
    next(setContent);
  };

  return (
    <div class={style.step} onClick={handler}>
      {content}
    </div>
  );
};

export default Options;
export { Action, Step, Title };
