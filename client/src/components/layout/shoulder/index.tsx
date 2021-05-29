import { FunctionComponent, h } from "preact";
import style from "./style.css";

export default ((props): h.JSX.Element => {
  return <div class={style.shoulder}>{props.children}</div>;
}) as FunctionComponent;
