import { h, FunctionComponent, ComponentChildren } from "preact";

import style from "./title.css";

interface TitleProps {
  children: ComponentChildren;
  class?: string;
}

const Title: FunctionComponent<TitleProps> = (props) => {
  const classes = [style.title, props.class || ""];
  return <div class={classes.join(" ")}>{props.children}</div>;
};

export default Title;
