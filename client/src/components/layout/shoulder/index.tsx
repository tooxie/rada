import { h } from "preact";

import style from "./style.css";

interface Props {
  detail?: boolean;
  children: JSX.Element | JSX.Element[];
}

export default (props: Props) => {
  const classes = [
    style.shoulder,
    props.detail ? style.detail : style.collection
  ].join(" ");

  return <div class={classes}>{props.children}</div>;
};
