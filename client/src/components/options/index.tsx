import { h, FunctionComponent, Fragment, ComponentChildren } from "preact";
import { useState } from "preact/hooks";

import Modal from "../modal";
import Title from "../modal/title";

import style from "./style.css";
import dots from "./dots.svg";

interface Props {
  icon?: string;
  title?: ComponentChildren;
  children: ComponentChildren;
}

const Options: FunctionComponent<Props> = ({ title, icon, children }) => {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible(!visible);

  return (
    <Fragment>
      <img src={icon || dots} class={style.trigger} onClick={toggle} />

      <Modal title={title} visible={visible} onDismiss={toggle}>
        {children}
      </Modal>
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
