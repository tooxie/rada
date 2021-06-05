import { Fragment, FunctionComponent, h } from "preact";
import { Suspense } from "preact/compat";

import DefaultHeader from "../../header";
import Shoulder from "../shoulder";
import Spinner from "../../spinner";

import { DetailProps } from "./types";
import style from "./style.css";

const Detail = (
  model: string,
  Component: FunctionComponent<DetailProps>,
  HeaderComponent?: FunctionComponent<DetailProps>
) => {
  const Header = HeaderComponent || DefaultHeader;
  const spinner = (
    <div class={style.spinner}>
      <Spinner />
    </div>
  );

  return (props: DetailProps) => (
    <Fragment>
      <Suspense fallback={<DefaultHeader />}>
        <Header key={`detail-header-${props.id}`} {...props} />
      </Suspense>
      <Shoulder detail={true} key="detshoulder">
        <Suspense fallback={spinner}>
          <Component key={`detail-shoulder-${props.id}`} {...props} />
        </Suspense>
      </Shoulder>
    </Fragment>
  );
};

export default Detail;
