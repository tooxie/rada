import { FunctionComponent, h } from "preact";
import style from "./style.css";

interface Props {
  id?: string;
  children?: JSX.Element[];
  model?: string;
}

export default ((props): h.JSX.Element => {
  const classes = [style.shoulder, style[props.model || ""]].join(" ");

  return <div class={classes}>{props.children}</div>;
}) as FunctionComponent<Props>;
