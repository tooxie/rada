import { h, Fragment } from "preact";

import Header from "../../header";
import Shoulder from "../shoulder";
import { ListComponent } from "../types";
import Logger from "../../../logger";

const log = new Logger(__filename);

const Collection = (Component: ListComponent): ListComponent => {
  log.debug("Detail component rendering:", Component.name);
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
