import { FunctionComponent, h } from "preact";

interface Props {
  id: string;
}

const Album: FunctionComponent<Props> = props => <h1>{props.id}</h1>;

export default Album;
