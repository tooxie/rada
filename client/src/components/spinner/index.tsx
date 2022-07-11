import { h } from "preact";

import style from "./style.css";
import spinner from "./spinner.gif";

interface SpinnerProps {
  message?: string;
}

const Spinner = ({ message }: SpinnerProps) => (
  <div class={style.spinner}>
    <img src={spinner} alt={message || "Loading..."} />
    {message === "" ? null : <p>{message || "Loading..."}</p>}
  </div>
);

export default Spinner;
