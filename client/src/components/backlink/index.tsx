import { FunctionComponent, h } from "preact";
import { Link } from "preact-router/match";

const back = () => window.history.back();

interface Classy {
  class: string;
}

const BackLink: FunctionComponent<Classy> = (props) => (
  <Link onClick={back} class={props.class}>
    {props.children}
  </Link>
);

export default BackLink;
