import { useContext } from "preact/hooks";

import AppStateContext from "../state/context";

export default () => useContext(AppStateContext);
