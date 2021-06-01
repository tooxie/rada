/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAlbumInput = {
  artists?: Array< CreateArtistInput > | null,
  title: string,
  coverUrl?: string | null,
};

export type CreateArtistInput = {
  name: string,
  imageUrl?: string | null,
};

export type Album = {
  __typename: "Album",
  id?: string,
  artists?:  Array<Artist > | null,
  title?: string | null,
  coverUrl?: string | null,
  tracks?: TrackConnection,
};

export type Artist = {
  __typename: "Artist",
  id?: string,
  name?: string | null,
  imageUrl?: string | null,
  albums?: AlbumConnection,
};

export type AlbumConnection = {
  __typename: "AlbumConnection",
  items?:  Array<Album > | null,
  nextToken?: string | null,
};

export type TrackConnection = {
  __typename: "TrackConnection",
  items?:  Array<Track > | null,
  nextToken?: string | null,
};

export type Track = {
  __typename: "Track",
  id?: string,
  albumId?: string,
  title?: string | null,
  lengthInSeconds?: number | null,
};

export type UpdateAlbumInput = {
  artists?: Array< UpdateArtistInput > | null,
  title?: string | null,
  coverUrl?: string | null,
};

export type UpdateArtistInput = {
  name?: string | null,
  imageUrl?: string | null,
};

export type CreatePlaylistInput = {
  name: string,
  imageUrl?: string | null,
};

export type Playlist = {
  __typename: "Playlist",
  id?: string,
  name?: string,
  imageUrl?: string | null,
};

export type UpdatePlaylistInput = {
  name?: string | null,
  imageUrl?: string | null,
};

export type CreateTrackInput = {
  albumId: string,
  title: string,
  lengthInSeconds?: number | null,
};

export type UpdateTrackInput = {
  albumId: string,
  title: string,
  lengthInSeconds?: number | null,
};

export type TableAlbumFilterInput = {
  title?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableArtistFilterInput = {
  name?: TableStringFilterInput | null,
};

export type ArtistConnection = {
  __typename: "ArtistConnection",
  items?:  Array<Artist > | null,
  nextToken?: string | null,
};

export type TablePlaylistFilterInput = {
  name?: TableStringFilterInput | null,
};

export type PlaylistConnection = {
  __typename: "PlaylistConnection",
  items?:  Array<Playlist > | null,
  nextToken?: string | null,
};

export type TableTrackFilterInput = {
  title?: TableStringFilterInput | null,
};

export type CreateAlbumMutationVariables = {
  input?: CreateAlbumInput,
};

export type CreateAlbumMutation = {
  createAlbum?:  {
    __typename: "Album",
    id: string,
    artists?:  Array< {
      __typename: "Artist",
      id: string,
      name?: string | null,
      imageUrl?: string | null,
      albums?:  {
        __typename: "AlbumConnection",
        nextToken?: string | null,
      } | null,
    } > | null,
    title?: string | null,
    coverUrl?: string | null,
    tracks?:  {
      __typename: "TrackConnection",
      items?:  Array< {
        __typename: "Track",
        id: string,
        albumId: string,
        title?: string | null,
        lengthInSeconds?: number | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateAlbumMutationVariables = {
  id?: string,
  input?: UpdateAlbumInput,
};

export type UpdateAlbumMutation = {
  updateAlbum?:  {
    __typename: "Album",
    id: string,
    artists?:  Array< {
      __typename: "Artist",
      id: string,
      name?: string | null,
      imageUrl?: string | null,
      albums?:  {
        __typename: "AlbumConnection",
        nextToken?: string | null,
      } | null,
    } > | null,
    title?: string | null,
    coverUrl?: string | null,
    tracks?:  {
      __typename: "TrackConnection",
      items?:  Array< {
        __typename: "Track",
        id: string,
        albumId: string,
        title?: string | null,
        lengthInSeconds?: number | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteAlbumMutationVariables = {
  id?: string,
};

export type DeleteAlbumMutation = {
  deleteAlbum?:  {
    __typename: "Album",
    id: string,
    artists?:  Array< {
      __typename: "Artist",
      id: string,
      name?: string | null,
      imageUrl?: string | null,
      albums?:  {
        __typename: "AlbumConnection",
        nextToken?: string | null,
      } | null,
    } > | null,
    title?: string | null,
    coverUrl?: string | null,
    tracks?:  {
      __typename: "TrackConnection",
      items?:  Array< {
        __typename: "Track",
        id: string,
        albumId: string,
        title?: string | null,
        lengthInSeconds?: number | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateArtistMutationVariables = {
  input?: CreateArtistInput,
};

export type CreateArtistMutation = {
  createArtist?:  {
    __typename: "Artist",
    id: string,
    name?: string | null,
    imageUrl?: string | null,
    albums?:  {
      __typename: "AlbumConnection",
      items?:  Array< {
        __typename: "Album",
        id: string,
        title?: string | null,
        coverUrl?: string | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateArtistMutationVariables = {
  id?: string,
  input?: UpdateArtistInput,
};

export type UpdateArtistMutation = {
  updateArtist?:  {
    __typename: "Artist",
    id: string,
    name?: string | null,
    imageUrl?: string | null,
    albums?:  {
      __typename: "AlbumConnection",
      items?:  Array< {
        __typename: "Album",
        id: string,
        title?: string | null,
        coverUrl?: string | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteArtistMutationVariables = {
  id?: string,
};

export type DeleteArtistMutation = {
  deleteArtist?:  {
    __typename: "Artist",
    id: string,
    name?: string | null,
    imageUrl?: string | null,
    albums?:  {
      __typename: "AlbumConnection",
      items?:  Array< {
        __typename: "Album",
        id: string,
        title?: string | null,
        coverUrl?: string | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreatePlaylistMutationVariables = {
  input?: CreatePlaylistInput,
};

export type CreatePlaylistMutation = {
  createPlaylist?:  {
    __typename: "Playlist",
    id: string,
    name: string,
    imageUrl?: string | null,
  } | null,
};

export type UpdatePlaylistMutationVariables = {
  id?: string,
  input?: UpdatePlaylistInput,
};

export type UpdatePlaylistMutation = {
  updatePlaylist?:  {
    __typename: "Playlist",
    id: string,
    name: string,
    imageUrl?: string | null,
  } | null,
};

export type DeletePlaylistMutationVariables = {
  id?: string,
};

export type DeletePlaylistMutation = {
  deletePlaylist?:  {
    __typename: "Playlist",
    id: string,
    name: string,
    imageUrl?: string | null,
  } | null,
};

export type CreateTrackMutationVariables = {
  input?: CreateTrackInput,
};

export type CreateTrackMutation = {
  createTrack?:  {
    __typename: "Track",
    id: string,
    albumId: string,
    title?: string | null,
    lengthInSeconds?: number | null,
  } | null,
};

export type UpdateTrackMutationVariables = {
  id?: string,
  input?: UpdateTrackInput,
};

export type UpdateTrackMutation = {
  updateTrack?:  {
    __typename: "Track",
    id: string,
    albumId: string,
    title?: string | null,
    lengthInSeconds?: number | null,
  } | null,
};

export type DeleteTrackMutationVariables = {
  id?: string,
};

export type DeleteTrackMutation = {
  deleteTrack?:  {
    __typename: "Track",
    id: string,
    albumId: string,
    title?: string | null,
    lengthInSeconds?: number | null,
  } | null,
};

export type GetAlbumQueryVariables = {
  id?: string,
};

export type GetAlbumQuery = {
  getAlbum?:  {
    __typename: "Album",
    id: string,
    artists?:  Array< {
      __typename: "Artist",
      id: string,
      name?: string | null,
      imageUrl?: string | null,
      albums?:  {
        __typename: "AlbumConnection",
        nextToken?: string | null,
      } | null,
    } > | null,
    title?: string | null,
    coverUrl?: string | null,
    tracks?:  {
      __typename: "TrackConnection",
      items?:  Array< {
        __typename: "Track",
        id: string,
        albumId: string,
        title?: string | null,
        lengthInSeconds?: number | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListAlbumsQueryVariables = {
  filter?: TableAlbumFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAlbumsQuery = {
  listAlbums?:  {
    __typename: "AlbumConnection",
    items?:  Array< {
      __typename: "Album",
      id: string,
      artists?:  Array< {
        __typename: "Artist",
        id: string,
        name?: string | null,
        imageUrl?: string | null,
      } > | null,
      title?: string | null,
      coverUrl?: string | null,
      tracks?:  {
        __typename: "TrackConnection",
        nextToken?: string | null,
      } | null,
    } > | null,
    nextToken?: string | null,
  } | null,
};

export type GetArtistQueryVariables = {
  id?: string,
};

export type GetArtistQuery = {
  getArtist?:  {
    __typename: "Artist",
    id: string,
    name?: string | null,
    imageUrl?: string | null,
    albums?:  {
      __typename: "AlbumConnection",
      items?:  Array< {
        __typename: "Album",
        id: string,
        title?: string | null,
        coverUrl?: string | null,
      } > | null,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListArtistsQueryVariables = {
  filter?: TableArtistFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListArtistsQuery = {
  listArtists?:  {
    __typename: "ArtistConnection",
    items?:  Array< {
      __typename: "Artist",
      id: string,
      name?: string | null,
      imageUrl?: string | null,
      albums?:  {
        __typename: "AlbumConnection",
        nextToken?: string | null,
      } | null,
    } > | null,
    nextToken?: string | null,
  } | null,
};

export type GetPlaylistQueryVariables = {
  id?: string,
};

export type GetPlaylistQuery = {
  getPlaylist?:  {
    __typename: "Playlist",
    id: string,
    name: string,
    imageUrl?: string | null,
  } | null,
};

export type ListPlaylistsQueryVariables = {
  filter?: TablePlaylistFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlaylistsQuery = {
  listPlaylists?:  {
    __typename: "PlaylistConnection",
    items?:  Array< {
      __typename: "Playlist",
      id: string,
      name: string,
      imageUrl?: string | null,
    } > | null,
    nextToken?: string | null,
  } | null,
};

export type GetTrackQueryVariables = {
  id?: string,
};

export type GetTrackQuery = {
  getTrack?:  {
    __typename: "Track",
    id: string,
    albumId: string,
    title?: string | null,
    lengthInSeconds?: number | null,
  } | null,
};

export type ListTracksQueryVariables = {
  filter?: TableTrackFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTracksQuery = {
  listTracks?:  {
    __typename: "TrackConnection",
    items?:  Array< {
      __typename: "Track",
      id: string,
      albumId: string,
      title?: string | null,
      lengthInSeconds?: number | null,
    } > | null,
    nextToken?: string | null,
  } | null,
};
