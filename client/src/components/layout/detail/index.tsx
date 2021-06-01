import { Fragment, FunctionComponent, h } from "preact";
import { Suspense } from "preact/compat";

import DefaultHeader from "../../header";
import Shoulder from "../shoulder";
import Spinner from "../../spinner";

import { DetailProps } from "./types";

const Detail = (
  model: string,
  Component: FunctionComponent<DetailProps>,
  HeaderComponent?: FunctionComponent<DetailProps>
) => {
  const Header = HeaderComponent || DefaultHeader;

  return (props: DetailProps) => (
    <Fragment>
      <Suspense fallback={<DefaultHeader />}>
        <Header {...props} />
      </Suspense>
      <Shoulder detail={true}>
        <Suspense fallback={<Spinner />}>
          <Component {...props} />
        </Suspense>
      </Shoulder>
    </Fragment>
  );
};

export default Detail;
