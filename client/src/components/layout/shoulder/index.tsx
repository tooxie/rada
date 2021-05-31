import { FunctionComponent, h } from "preact";
import style from "./style.css";

export default (props => {
  return <div class={style.shoulder}>{props.children}</div>;
}) as FunctionComponent;
