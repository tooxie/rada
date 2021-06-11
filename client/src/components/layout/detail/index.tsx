import { Fragment, FunctionComponent, h } from "preact";

import DefaultHeader from "../../header";
import Shoulder from "../shoulder";

import { DetailProps } from "./types";

const Detail = (
  model: string,
  Component: FunctionComponent<DetailProps>,
  HeaderComponent?: FunctionComponent<DetailProps>
) => {
  const Header = HeaderComponent || DefaultHeader;

  return (props: DetailProps) => (
    <Fragment>
      <Header key={`detail-header-${props.id}`} {...props} />
      <Shoulder detail={true} key="detshoulder">
        <Component key={`detail-shoulder-${props.id}`} {...props} />
      </Shoulder>
    </Fragment>
  );
};

export default Detail;
