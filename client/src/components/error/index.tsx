import { Fragment, h } from "preact";

interface ErrorMsgProps {
  error: Error;
  margin?: number;
}

const ErrorMsg = ({ error, margin }: ErrorMsgProps) => (
  <Fragment>
    <p style={{ paddingTop: margin ? `${margin}rem` : "1rem" }}>{error.message}</p>
    <button onClick={() => location.reload()}>Retry?</button>
  </Fragment>
);

export default ErrorMsg;
