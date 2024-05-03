import { h, FunctionComponent } from "preact";

import icon from "./clear.svg";
import style from "./clear.css";

interface Props {
  onClick: () => void;
}

const Clear: FunctionComponent<Props> = (props) => {
  return (
    <div class={style.icon} onClick={props.onClick}>
      <img src={icon} />
    </div>
  );
};

export default Clear;
