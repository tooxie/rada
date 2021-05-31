import { FunctionComponent, h } from "preact";
import { Suspense } from "preact/compat";

import { DetailProps } from "./types";
import DefaultHeader from "../../header";
import Shoulder from "../shoulder";
import Spinner from "../../spinner";

const Detail = (
  model: string,
  Component: FunctionComponent<DetailProps>,
  HeaderComponent?: FunctionComponent<DetailProps>
) => {
  const Header = HeaderComponent || DefaultHeader;

  return (props: DetailProps) => (
    <div class={`detail ${model.toLowerCase()}`}>
      <Suspense fallback={<DefaultHeader />}>
        <Header {...props} />
      </Suspense>
      <Shoulder>
        <Suspense fallback={<Spinner />}>
          <Component {...props} />
        </Suspense>
      </Shoulder>
    </div>
  );
};

export default Detail;
