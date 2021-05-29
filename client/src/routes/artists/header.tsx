import { FunctionComponent, h } from "preact";
import Navigation from "../../components/navigation";
import style from "./style.css";

interface Props {
  img: string;
}

const Header: FunctionComponent<Props> = ({ img }) => (
  <header class={style.header} style={{ backgroundImage: `url(${img})` }}>
    <Navigation />
  </header>
);

export default Header;
