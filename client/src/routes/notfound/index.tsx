import { FunctionComponent, h } from "preact";
import style from "./style.css";

const Notfound: FunctionComponent = () => {
  return (
    <div class={style.notfound}>
      <h1>Page not found</h1>
      <p>Sorry, we couldn&apos;t find the page you requested.</p>
    </div>
  );
};

export default Notfound;
