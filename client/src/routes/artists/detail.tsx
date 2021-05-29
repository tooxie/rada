import { FunctionComponent, h } from "preact";

interface Props {
  id: string;
}

const Artist: FunctionComponent<Props> = (props: Props) => <h1>{props.id}</h1>;

export default Artist;
