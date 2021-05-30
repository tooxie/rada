import { FunctionComponent, h } from "preact";
import { DetailProps } from "../../components/layout/detail/types";

const Artist: FunctionComponent<DetailProps> = props => <h1>{props.id}</h1>;

export default Artist;
