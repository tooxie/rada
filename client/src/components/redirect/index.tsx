import { Component } from "preact";
import { route } from "preact-router";

interface RedirectProps {
  path: string;
  to: string;
}

class Redirect extends Component<RedirectProps> {
  render() {
    route(this.props.to, true);
    return null;
  }
}

export default Redirect;
