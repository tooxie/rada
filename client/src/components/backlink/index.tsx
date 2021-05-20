import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";

export default (({ children }) => (
  <Link onClick={() => window.history.back()}>{children}</Link>
)) as FunctionalComponent;
