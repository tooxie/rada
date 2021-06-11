import { Fragment, FunctionComponent, h } from "preact";

import Shoulder from "../shoulder";
import Header from "../../header";

export default (model: string, Component: FunctionComponent): FunctionComponent => {
  return (props) => (
    <Fragment>
      <Header key={`collection-header-${model}`} />
      <Shoulder>
        <Component key={`collection-shoulder-${model}`} {...props} />
      </Shoulder>
    </Fragment>
  );
};
