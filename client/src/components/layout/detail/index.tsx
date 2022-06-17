import { Fragment, FunctionComponent, h } from "preact";

import DefaultHeader from "../../header";
import Shoulder from "../shoulder";
import usePlayer from "../../../hooks/useplayer";
import Logger from "../../../logger";

import { DetailProps } from "../types";

const log = new Logger(__filename);

const Detail = (
  Component: FunctionComponent<DetailProps>,
  HeaderComponent: FunctionComponent<DetailProps>,
  entity: "album" | "artist"
) => {
  log.debug(`Detail component for ${entity}`);
  const Header = HeaderComponent || DefaultHeader;

  return (props: DetailProps) => {
    log.debug(`${entity}Detail("${props.id}", "${props.serverId}")`);
    const player = usePlayer();
    if (!player) return null;

    const id = `${entity}:${props.id}`;

    return (
      <Fragment>
        <Header key={`detail-header-${props.id}`} id={id} serverId={props.serverId} />
        <Shoulder key={`detail-shoulder-${props.id}`} detail={true} noPadding={true}>
          <Component {...props} id={id} serverId={props.serverId} />
        </Shoulder>
      </Fragment>
    );
  };
};

export default Detail;
