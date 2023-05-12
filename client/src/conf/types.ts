import type { Server } from "../graphql/api";

import config from "../config.json";

export enum ArtistListTypes {
  Mosaic = "mosaic",
  List = "list",
  Thumbnails = "thumbs",
}

export enum AlbumListTypes {
  Grid = "grid",
  List = "list",
  Thumbnails = "thumbs",
}

export enum TrackSelectionTypes {
  AppendOne = "one",
  AppendFrom = "from",
}

export interface Conf {
  [key: string]: any;
  searchEnabled: boolean;
  artistListType: ArtistListTypes;
  albumListType: AlbumListTypes;
  trackSelection: TrackSelectionTypes;
  currentServer: Server;
}

export const DefaultServer: Server = {
  __typename: "Server",
  id: config.server.id,
  name: config.server.name,
  apiUrl: config.server.api,
  timestamp: 0, // Math.round(Number(new Date()) / 1000),
};

export interface ConfHook {
  conf: Conf;
  setConf: (c: Conf) => void;
}
