import { FunctionComponent, h } from "preact";
import { Link } from "preact-router/match";

const back = () => window.history.back();

const BackLink: FunctionComponent = (props) => (
  <Link onClick={back}>{props.children}</Link>
);

export default BackLink;
