import { FunctionComponent, h } from "preact";
import style from "./style.css";
import spinner from "./spinner.gif";

const Header: FunctionComponent = () => (
  <div class={style.spinner}>
    <img src={spinner} />
    <p>Loading...</p>
  </div>
);

export default Header;
