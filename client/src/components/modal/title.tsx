import { h, ComponentChildren } from "preact";

import style from "./title.css";

interface TitleProps {
  children: ComponentChildren;
}

const Title = (props: TitleProps) => <div class={style.title}>{props.children}</div>;

export default Title;
