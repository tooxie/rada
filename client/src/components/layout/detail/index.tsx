import { FunctionComponent, h } from "preact";
import DefaultHeader from "../../header";
import Shoulder from "../shoulder";

const Detail = (
  model: string,
  Component: FunctionComponent<any>,
  header?: FunctionComponent<any>
): FunctionComponent => {
  const Header = header || DefaultHeader;

  return props => {
    return (
      <div>
        <Header {...props} model={model} />
        <Shoulder model={model}>
          <Component {...props} model={model} />
        </Shoulder>
      </div>
    );
  };
};

export default Detail;
