import { h, FunctionComponent, ComponentChild } from "preact";

import style from "./style.css";

interface ShoulderProps {
  children: ComponentChild;
  detail?: boolean;
  noPadding?: boolean;
}

const Shoulder: FunctionComponent<ShoulderProps> = (props) => {
  const classes = [
    style.shoulder,
    props.detail ? style.detail : style.collection,
    !props.noPadding && style.padding,
  ];

  return (
    <div key="shoulder" id="shoulder" class={classes.join(" ")}>
      {props.children}
    </div>
  );
};

export default Shoulder;
