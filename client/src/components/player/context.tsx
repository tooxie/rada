import { createContext } from "preact";

import { IPlayer } from "../../player/types";

const PlayerContext = createContext<IPlayer | null>(null);

export default PlayerContext;
