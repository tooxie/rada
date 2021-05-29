import { FunctionComponent, h } from "preact";
import Shoulder from "../shoulder";
import Header from "../../header";

export default (Component: FunctionComponent): FunctionComponent => {
  return props => (
    <div>
      <Header />
      <Shoulder>
        <Component {...props} />
      </Shoulder>
    </div>
  );
};
