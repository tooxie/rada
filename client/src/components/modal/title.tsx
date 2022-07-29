import { h, ComponentChildren } from "preact";

import style from "./title.css";

interface TitleProps {
  children: ComponentChildren;
  class?: string;
}

const Title = (props: TitleProps) => {
  const classes = [style.title, props.class || ""];
  return <div class={classes.join(" ")}>{props.children}</div>;
};

export default Title;
