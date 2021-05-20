import { FunctionalComponent, h } from "preact";
import style from "./style.css";

export interface HeaderProps {
  navigation: HTMLElement[];
}

const Header: FunctionalComponent = ({ children }) => {
  return (
    <header class={style.header}>
      <h1>Gawshi Client</h1>
      {children}
    </header>
  );
};

export default Header;
