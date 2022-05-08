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

export interface Conf {
  [key: string]: any;
  searchEnabled: boolean;
  isAdmin?: boolean;
  artistListType: ArtistListTypes;
  albumListType: AlbumListTypes;
}

export interface ConfHook {
  conf: Conf;
  setConf: (c: Conf) => void;
}
