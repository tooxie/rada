import { h, Fragment } from "preact";

import Header from "../../header";
import Shoulder from "../shoulder";
import { ListComponent } from "../types";

const Collection = (Component: ListComponent): ListComponent => {
  return (props) => (
    <Fragment>
      <Header key="collection-header" />
      <Shoulder key="collection-shoulder">
        <Component {...props} serverId={props.serverId} />
      </Shoulder>
    </Fragment>
  );
};

export default Collection;
