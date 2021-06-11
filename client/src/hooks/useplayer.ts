import { useContext } from "preact/hooks";

import PlayerContext from "../components/player/context";

const usePlayer = () => useContext(PlayerContext);

export default usePlayer;
