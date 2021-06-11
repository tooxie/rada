import { h } from "preact";
import { route } from "preact-router";

import Spinner from "../../components/spinner";

const Home = () => {
  route("/artists");

  return <Spinner />;
};

export default Home;
