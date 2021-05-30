import { FunctionComponent, h } from "preact";
import { Suspense } from "preact/compat";

import Shoulder from "../shoulder";
import Header from "../../header";
import Spinner from "../../spinner";

export default (Component: FunctionComponent): FunctionComponent => {
  return props => (
    <div>
      <Header />
      <Shoulder>
        <Suspense fallback={<Spinner />}>
          <Component {...props} />
        </Suspense>
      </Shoulder>
    </div>
  );
};
