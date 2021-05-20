import { FunctionalComponent, h } from "preact";
import Navigation from "../../navigation";
import style from "./style.css";

export default (Component: FunctionalComponent): FunctionalComponent => {
  return props => (
    <div class={style.header}>
      <Navigation />
      <p>-- Detail</p>
      <Component {...props} />
    </div>
  );
};
