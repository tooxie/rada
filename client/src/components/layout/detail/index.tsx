import { FunctionComponent, h } from "preact";
import DefaultHeader from "../../header";
import Shoulder from "../shoulder";

const Detail = (
  Component: FunctionComponent<any>,
  header?: FunctionComponent<any>
): FunctionComponent => {
  const Header = header || DefaultHeader;

  return props => (
    <div>
      <Header {...props} />
      <Shoulder>
        <Component {...props} />
      </Shoulder>
    </div>
  );
};

export default Detail;
