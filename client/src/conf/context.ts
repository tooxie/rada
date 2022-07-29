import { createContext } from "preact";

import config from "../config.json";

import {
  AlbumListTypes,
  ArtistListTypes,
  Conf,
  ConfHook,
  DefaultServer,
  TrackSelectionTypes,
} from "./types";

const defaultConf: Conf = {
  config,
  searchEnabled: false,
  artistListType: ArtistListTypes.Mosaic,
  albumListType: AlbumListTypes.Grid,
  trackSelection: TrackSelectionTypes.AppendFrom,
  currentServer: DefaultServer,
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
