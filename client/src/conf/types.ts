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
}

export interface ConfHook {
  conf: Conf;
  setConf: (c: Conf) => void;
}
