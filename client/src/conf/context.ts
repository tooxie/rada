import { createContext } from "preact";

import { Conf, ConfHook, ArtistListTypes, AlbumListTypes } from "./types";

const defaultConf = {
  searchEnabled: false,
  artistListType: ArtistListTypes.Mosaic,
  albumListType: AlbumListTypes.Grid,
};

export const getDefaultConf = (): Conf => {
  const persisted = localStorage.getItem("GawshiConf");
  if (persisted) {
    return {
      ...defaultConf,
      ...JSON.parse(persisted),
    } as Conf;
  }

  return defaultConf;
};

const ConfContext = createContext<ConfHook>({
  conf: defaultConf,
  setConf: () => {},
});

export default ConfContext;
