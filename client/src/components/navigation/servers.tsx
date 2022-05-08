import { h } from "preact";

import Options, { Action, Title } from "../../components/options";

import icon from "./servers.svg";
import style from "./servers.css";

const Servers = () => (
  <Options icon={icon}>
    <Title>Servers</Title>
    <Action>Server selection goes here.</Action>
  </Options>
);

export default Servers;
