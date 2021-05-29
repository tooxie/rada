import { FunctionalComponent, h } from "preact";
import Navigation from "../../components/navigation";
import style from "./style.css";

interface Props {
  img: string;
}

const Header: FunctionalComponent<Props> = ({ img }) => (
  <header class={style.header} style={{ backgroundImage: `url(${img})` }}>
    <Navigation />
  </header>
);

export default Header;
