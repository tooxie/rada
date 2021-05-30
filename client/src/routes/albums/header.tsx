import { FunctionComponent, h } from "preact";
import { DetailProps } from "../../components/layout/detail/types";
import Navigation from "../../components/navigation";
import style from "./style.css";

const Header: FunctionComponent<DetailProps> = ({ id }) => (
  <header class={style.header} style={{ backgroundImage: `url(${id})` }}>
    <Navigation />
  </header>
);

export default Header;
