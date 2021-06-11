/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateArtistInput = {
  name: string;
  imageUrl?: string | null;
  albums?: Array<CreateAlbumInput | null> | null;
};

export type CreateAlbumInput = {
  artists?: Array<string> | null;
  name: string;
  imageUrl?: string | null;
  year?: number | null;
};

export type Artist = {
  __typename: "Artist";
  id?: string;
  name?: string | null;
  imageUrl?: string | null;
  albums?: Array<Album> | null;
};

export type Album = {
  __typename: "Album";
  id?: string;
  artists?: Array<Artist> | null;
  name?: string | null;
  imageUrl?: string | null;
  year?: number | null;
  tracks?: Array<Track> | null;
};

export type Track = {
  __typename: "Track";
  id?: string;
  albumId?: string;
  title?: string | null;
  lengthInSeconds?: number | null;
  number?: number | null;
};

export type UpdateArtistInput = {
  name?: string | null;
  imageUrl?: string | null;
};

export type UpdateAlbumInput = {
  name?: string | null;
  imageUrl?: string | null;
  year?: number | null;
};

export type CreateTrackInput = {
  albumId: string;
  title: string;
  lengthInSeconds?: number | null;
  number?: number | null;
};

export type UpdateTrackInput = {
  albumId: string;
  title: string;
  lengthInSeconds?: number | null;
  number?: number | null;
};

export type CreatePlaylistInput = {
  name: string;
  imageUrl?: string | null;
};

export type Playlist = {
  __typename: "Playlist";
  id?: string;
  name?: string;
  imageUrl?: string | null;
};

export type UpdatePlaylistInput = {
  name?: string | null;
  imageUrl?: string | null;
};

export type TableAlbumFilterInput = {
  name?: TableStringFilterInput | null;
};

export type TableStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type AlbumConnection = {
  __typename: "AlbumConnection";
  items?: Array<Album> | null;
};

export type TableArtistFilterInput = {
  name?: TableStringFilterInput | null;
};

export type ArtistConnection = {
  __typename: "ArtistConnection";
  items?: Array<Artist> | null;
};

export type TablePlaylistFilterInput = {
  name?: TableStringFilterInput | null;
};

export type PlaylistConnection = {
  __typename: "PlaylistConnection";
  items?: Array<Playlist> | null;
};

export type TableTrackFilterInput = {
  title?: TableStringFilterInput | null;
};

export type TrackConnection = {
  __typename: "TrackConnection";
  items?: Array<Track> | null;
};

export type CreateArtistMutationVariables = {
  input?: CreateArtistInput;
};

export type CreateArtistMutation = {
  createArtist?: {
    __typename: "Artist";
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type UpdateArtistMutationVariables = {
  id?: string;
  input?: UpdateArtistInput;
};

export type UpdateArtistMutation = {
  updateArtist?: {
    __typename: "Artist";
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type DeleteArtistMutationVariables = {
  id?: string;
};

export type DeleteArtistMutation = {
  deleteArtist?: {
    __typename: "Artist";
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type DeleteCascadeArtistMutationVariables = {
  id?: string;
};

export type DeleteCascadeArtistMutation = {
  deleteCascadeArtist?: {
    __typename: "Artist";
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type UpdateOrCreateArtistMutationVariables = {
  input?: CreateArtistInput;
};

export type UpdateOrCreateArtistMutation = {
  updateOrCreateArtist?: {
    __typename: "Artist";
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type CreateAlbumMutationVariables = {
  input?: CreateAlbumInput;
};

export type CreateAlbumMutation = {
  createAlbum?: {
    __typename: "Album";
    id: string;
    artists?: Array<{
      __typename: "Artist";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    tracks?: Array<{
      __typename: "Track";
      id: string;
      albumId: string;
      title?: string | null;
      lengthInSeconds?: number | null;
      number?: number | null;
    }> | null;
  } | null;
};

export type UpdateAlbumMutationVariables = {
  id?: string;
  input?: UpdateAlbumInput;
};

export type UpdateAlbumMutation = {
  updateAlbum?: {
    __typename: "Album";
    id: string;
    artists?: Array<{
      __typename: "Artist";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    tracks?: Array<{
      __typename: "Track";
      id: string;
      albumId: string;
      title?: string | null;
      lengthInSeconds?: number | null;
      number?: number | null;
    }> | null;
  } | null;
};

export type DeleteAlbumMutationVariables = {
  id?: string;
};

export type DeleteAlbumMutation = {
  deleteAlbum?: {
    __typename: "Album";
    id: string;
    artists?: Array<{
      __typename: "Artist";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    tracks?: Array<{
      __typename: "Track";
      id: string;
      albumId: string;
      title?: string | null;
      lengthInSeconds?: number | null;
      number?: number | null;
    }> | null;
  } | null;
};

export type UpdateOrCreateAlbumMutationVariables = {
  input?: CreateAlbumInput;
};

export type UpdateOrCreateAlbumMutation = {
  updateOrCreateAlbum?: {
    __typename: "Album";
    id: string;
    artists?: Array<{
      __typename: "Artist";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    tracks?: Array<{
      __typename: "Track";
      id: string;
      albumId: string;
      title?: string | null;
      lengthInSeconds?: number | null;
      number?: number | null;
    }> | null;
  } | null;
};

export type CreateTrackMutationVariables = {
  input?: CreateTrackInput;
};

export type CreateTrackMutation = {
  createTrack?: {
    __typename: "Track";
    id: string;
    albumId: string;
    title?: string | null;
    lengthInSeconds?: number | null;
    number?: number | null;
  } | null;
};

export type UpdateTrackMutationVariables = {
  id?: string;
  input?: UpdateTrackInput;
};

export type UpdateTrackMutation = {
  updateTrack?: {
    __typename: "Track";
    id: string;
    albumId: string;
    title?: string | null;
    lengthInSeconds?: number | null;
    number?: number | null;
  } | null;
};

export type DeleteTrackMutationVariables = {
  id?: string;
};

export type DeleteTrackMutation = {
  deleteTrack?: {
    __typename: "Track";
    id: string;
    albumId: string;
    title?: string | null;
    lengthInSeconds?: number | null;
    number?: number | null;
  } | null;
};

export type UpdateOrCreateTrackMutationVariables = {
  input?: CreateTrackInput;
};

export type UpdateOrCreateTrackMutation = {
  updateOrCreateTrack?: {
    __typename: "Track";
    id: string;
    albumId: string;
    title?: string | null;
    lengthInSeconds?: number | null;
    number?: number | null;
  } | null;
};

export type CreatePlaylistMutationVariables = {
  input?: CreatePlaylistInput;
};

export type CreatePlaylistMutation = {
  createPlaylist?: {
    __typename: "Playlist";
    id: string;
    name: string;
    imageUrl?: string | null;
  } | null;
};

export type UpdatePlaylistMutationVariables = {
  id?: string;
  input?: UpdatePlaylistInput;
};

export type UpdatePlaylistMutation = {
  updatePlaylist?: {
    __typename: "Playlist";
    id: string;
    name: string;
    imageUrl?: string | null;
  } | null;
};

export type DeletePlaylistMutationVariables = {
  id?: string;
};

export type DeletePlaylistMutation = {
  deletePlaylist?: {
    __typename: "Playlist";
    id: string;
    name: string;
    imageUrl?: string | null;
  } | null;
};

export type GetAlbumQueryVariables = {
  id?: string;
};

export type GetAlbumQuery = {
  getAlbum?: {
    __typename: "Album";
    id: string;
    artists?: Array<{
      __typename: "Artist";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    tracks?: Array<{
      __typename: "Track";
      id: string;
      albumId: string;
      title?: string | null;
      lengthInSeconds?: number | null;
      number?: number | null;
    }> | null;
  } | null;
};

export type ListAlbumsQueryVariables = {
  filter?: TableAlbumFilterInput | null;
};

export type ListAlbumsQuery = {
  listAlbums?: {
    __typename: "AlbumConnection";
    items?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type GetArtistQueryVariables = {
  id?: string;
};

export type GetArtistQuery = {
  getArtist?: {
    __typename: "Artist";
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
    }> | null;
  } | null;
};

export type ListArtistsQueryVariables = {
  filter?: TableArtistFilterInput | null;
};

export type ListArtistsQuery = {
  listArtists?: {
    __typename: "ArtistConnection";
    items?: Array<{
      __typename: "Artist";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
  } | null;
};

export type GetPlaylistQueryVariables = {
  id?: string;
};

export type GetPlaylistQuery = {
  getPlaylist?: {
    __typename: "Playlist";
    id: string;
    name: string;
    imageUrl?: string | null;
  } | null;
};

export type ListPlaylistsQueryVariables = {
  filter?: TablePlaylistFilterInput | null;
};

export type ListPlaylistsQuery = {
  listPlaylists?: {
    __typename: "PlaylistConnection";
    items?: Array<{
      __typename: "Playlist";
      id: string;
      name: string;
      imageUrl?: string | null;
    }> | null;
  } | null;
};

export type GetTrackQueryVariables = {
  id?: string;
};

export type GetTrackQuery = {
  getTrack?: {
    __typename: "Track";
    id: string;
    albumId: string;
    title?: string | null;
    lengthInSeconds?: number | null;
    number?: number | null;
  } | null;
};

export type ListTracksQueryVariables = {
  filter?: TableTrackFilterInput | null;
};

export type ListTracksQuery = {
  listTracks?: {
    __typename: "TrackConnection";
    items?: Array<{
      __typename: "Track";
      id: string;
      albumId: string;
      title?: string | null;
      lengthInSeconds?: number | null;
      number?: number | null;
    }> | null;
  } | null;
};
