import { FunctionalComponent, h } from "preact";
import Shoulder from "../shoulder";
import Header from "../../header";

export default (Component: FunctionalComponent): FunctionalComponent => {
  return props => (
    <div>
      <Header />
      <Shoulder>
        <Component {...props} />
      </Shoulder>
    </div>
  );
};
