import { Fragment, h } from "preact";

import style from "./style.css";

interface ErrorMsgProps {
  error: string;
  margin?: number;
}

const ErrorMsg = ({ error, margin }: ErrorMsgProps) => (
  <Fragment>
    <p class={style.error} style={{ paddingTop: margin ? `${margin}rem` : "1rem" }}>
      {error}
    </p>
    <p class={style.error}>
      <button onClick={() => location.reload()}>Retry?</button>
    </p>
  </Fragment>
);

export default ErrorMsg;
