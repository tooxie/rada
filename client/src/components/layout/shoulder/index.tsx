import { h, ComponentChild } from "preact";

import style from "./style.css";

interface ShoulderProps {
  children: ComponentChild;
  detail?: boolean;
  noPadding?: boolean;
}

const Shoulder = (props: ShoulderProps) => {
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
