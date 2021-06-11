import { useContext } from "preact/hooks";

import ApolloContext from "./context";

const useClient = () => useContext(ApolloContext);

export default useClient;
