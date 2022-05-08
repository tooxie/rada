import { h, Fragment, FunctionComponent } from "preact";

import Header from "../../header";
import Shoulder from "../shoulder";

const Collection = (Component: FunctionComponent): FunctionComponent => {
  return (props) => (
    <Fragment>
      <Header key="collection-header" />
      <Shoulder key="collection-shoulder">
        <Component {...props} />
      </Shoulder>
    </Fragment>
  );
};

export default Collection;
