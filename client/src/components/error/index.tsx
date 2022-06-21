import { Fragment, h } from "preact";

import style from "./style.css";

interface ErrorMsgProps {
  error: string;
  margins?: boolean;
}

const ErrorMsg = ({ error, margins }: ErrorMsgProps) => (
  <Fragment>
    <p class={margins ? style.margins : ""}>{error}</p>
    <p class={style.retry}>
      <button onClick={() => location.reload()}>Retry?</button>
    </p>
  </Fragment>
);

export default ErrorMsg;
