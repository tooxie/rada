import { Fragment, FunctionComponent, h } from "preact";

import DefaultHeader from "../../header";
import Shoulder from "../shoulder";
import usePlayer from "../../../hooks/useplayer";

import { DetailProps } from "./types";

const Detail = (
  Component: FunctionComponent<DetailProps>,
  HeaderComponent?: FunctionComponent<DetailProps>
) => {
  const Header = HeaderComponent || DefaultHeader;

  return (props: DetailProps) => {
    const player = usePlayer();
    if (!player) return null;

    const getEntity = () => window.location.pathname.split("/")[1];
    const getId = (props: DetailProps): any => `${getEntity()}:${props.id}`;

    return (
      <Fragment>
        <Header key={`detail-header-${props.id}`} id={getId(props)} />
        <Shoulder key={`detail-shoulder-${props.id}`} detail={true} noPadding={true}>
          <Component {...props} id={getId(props)} />
        </Shoulder>
      </Fragment>
    );
  };
};

export default Detail;
