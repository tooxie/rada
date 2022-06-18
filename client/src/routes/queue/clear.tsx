import { h } from "preact";

import icon from "./clear.svg";
import style from "./clear.css";

interface Props {
  onClick: () => void;
}

const Clear = (props: Props) => {
  return (
    <div class={style.icon} onClick={props.onClick}>
      <img src={icon} />
    </div>
  );
};

export default Clear;
