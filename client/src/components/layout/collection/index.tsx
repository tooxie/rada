import { Fragment, FunctionComponent, h } from "preact";
import { Suspense } from "preact/compat";

import Shoulder from "../shoulder";
import Header from "../../header";
import Spinner from "../../spinner";

export default (model: string, Component: FunctionComponent): FunctionComponent => {
  return (props) => (
    <Fragment>
      <Header key={`collection-header-${model}`} />
      <Shoulder>
        <Suspense fallback={<Spinner />}>
          <Component key={`collection-shoulder-${model}`} {...props} />
        </Suspense>
      </Shoulder>
    </Fragment>
  );
};
