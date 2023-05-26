/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Album = {
  __typename: "Album";
  serverId: string;
  id: string;
  artists?: Array<Artist> | null;
  name?: string | null;
  imageUrl?: string | null;
  year?: number | null;
  volumes: number;
  tracks?: Array<Track> | null;
  isVa?: boolean | null;
};

export type Artist = {
  __typename: "Artist";
  serverId: string;
  id: string;
  name?: string | null;
  imageUrl?: string | null;
  albums?: Array<Album> | null;
};

export type Track = {
  __typename: "Track";
  serverId: string;
  albumId: string;
  id: string;
  album?: Album | null;
  artists?: Array<Artist> | null;
  url: string;
  title?: string | null;
  info?: string | null;
  lengthInSeconds?: number | null;
  ordinal?: number | null;
  volume: number;
  side: number;
  hash: string;
  features?: Array<string> | null;
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
  volumes: number;
};

export type UpdateArtistInput = {
  name?: string | null;
  imageUrl?: string | null;
};

export type UpdateAlbumInput = {
  name?: string | null;
  imageUrl?: string | null;
  year?: number | null;
  volumes?: number | null;
};

export type CreateTrackInput = {
  albumId: string;
  url: string;
  title?: string | null;
  lengthInSeconds?: number | null;
  ordinal?: number | null;
  volume: number;
  side: number;
  artists?: Array<string> | null;
  hash: string;
};

export type UpdateTrackInput = {
  title?: string | null;
  url?: string | null;
  lengthInSeconds?: number | null;
  ordinal?: number | null;
  volume?: number | null;
  side?: number | null;
  artists?: Array<string> | null;
  hash?: string | null;
};

export type RegisterServerInput = {
  invite: RegisterServerInviteInput;
  server: RegisterServerServerInput;
};

export type RegisterServerInviteInput = {
  id: string;
  timestamp: number;
  secret: string;
  clientIdUrl: string;
};

export type RegisterServerServerInput = {
  id: string;
  name: string;
  apiUrl: string;
  idpUrl: string;
  headerUrl?: string | null;
};

export type Server = {
  __typename: "Server";
  id: string;
  name: string;
  note?: string | null;
  apiUrl: string;
  headerUrl?: string | null;
  timestamp: number;
  banned?: boolean | null;
  userPoolId: string;
  clientId: string;
  region: string;
  idpUrl: string;
  identityPoolId: string;
};

export type CreateServerInviteResponse = {
  __typename: "CreateServerInviteResponse";
  id: string;
  timestamp: number;
  secret: string;
  clientIdUrl: string;
};

export type ServerInvite = {
  __typename: "ServerInvite";
  id: string;
  timestamp: number;
};

export type CreateInviteInput = {
  note?: string | null;
  validity?: number | null;
  isAdmin?: boolean | null;
};

export type InviteUrl = {
  __typename: "InviteUrl";
  claimUrl: string;
};

export type TrackConnection = {
  __typename: "TrackConnection";
  items?: Array<Track> | null;
};

export type ServerConnection = {
  __typename: "ServerConnection";
  items?: Array<Server> | null;
};

export type ServerInviteConnection = {
  __typename: "ServerInviteConnection";
  items?: Array<ServerInvite> | null;
};

export type Invite = {
  __typename: "Invite";
  id: string;
  timestamp: number;
  note?: string | null;
  validity?: number | null;
  visited?: number | null;
  installed?: number | null;
  unsolicited?: number | null;
};

export type TableInviteFilterInput = {
  id?: TableIDFilterInput | null;
  timestamp?: TableStringFilterInput | null;
  note?: TableStringFilterInput | null;
  visited?: TableIntFilterInput | null;
  installed?: TableIntFilterInput | null;
  unsolicited?: TableIntFilterInput | null;
};

export type TableIDFilterInput = {
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

export type TableIntFilterInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  contains?: number | null;
  notContains?: number | null;
  between?: Array<number | null> | null;
};

export type InviteConnection = {
  __typename: "InviteConnection";
  items?: Array<Invite> | null;
};

export type GetAlbumOnlyQueryVariables = {
  id: string;
};

export type GetAlbumOnlyQuery = {
  getAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    isVa?: boolean | null;
  } | null;
};

export type GetAlbumWithTracksQueryVariables = {
  id: string;
};

export type GetAlbumWithTracksQuery = {
  getAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    isVa?: boolean | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
    }> | null;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
      artists?: Array<{
        __typename: "Artist";
        serverId: string;
        id: string;
        name?: string | null;
      }> | null;
      album?: {
        __typename: "Album";
        serverId: string;
        id: string;
        name?: string | null;
        imageUrl?: string | null;
        isVa?: boolean | null;
        volumes: number;
      } | null;
    }> | null;
  } | null;
};

export type GetArtistInAlbumQueryVariables = {
  id: string;
};

export type GetArtistInAlbumQuery = {
  getArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      artists?: Array<{
        __typename: "Artist";
        serverId: string;
        id: string;
      }> | null;
    }> | null;
  } | null;
};

export type ListAlbumsWithArtistsQueryVariables = {
  filter?: TableAlbumFilterInput | null;
};

export type ListAlbumsWithArtistsQuery = {
  listAlbums?: {
    __typename: "AlbumConnection";
    items?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      isVa?: boolean | null;
      artists?: Array<{
        __typename: "Artist";
        serverId: string;
        id: string;
        name?: string | null;
      }> | null;
    }> | null;
  } | null;
};

export type ListArtistsWithAlbumsQueryVariables = {
  filter?: TableArtistFilterInput | null;
};

export type ListArtistsWithAlbumsQuery = {
  listArtists?: {
    __typename: "ArtistConnection";
    items?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      albums?: Array<{
        __typename: "Album";
        serverId: string;
        id: string;
        name?: string | null;
        imageUrl?: string | null;
      }> | null;
      name?: string | null;
    }> | null;
  } | null;
};

export type CreateArtistMutationVariables = {
  input: CreateArtistInput;
};

export type CreateArtistMutation = {
  createArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type UpdateArtistMutationVariables = {
  id: string;
  input: UpdateArtistInput;
};

export type UpdateArtistMutation = {
  updateArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type DeleteArtistMutationVariables = {
  id: string;
};

export type DeleteArtistMutation = {
  deleteArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type DeleteCascadeArtistMutationVariables = {
  id: string;
};

export type DeleteCascadeArtistMutation = {
  deleteCascadeArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type CreateAlbumMutationVariables = {
  input: CreateAlbumInput;
};

export type CreateAlbumMutation = {
  createAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type UpdateAlbumMutationVariables = {
  id: string;
  input: UpdateAlbumInput;
};

export type UpdateAlbumMutation = {
  updateAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type DeleteAlbumMutationVariables = {
  id: string;
};

export type DeleteAlbumMutation = {
  deleteAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type DeleteCascadeAlbumMutationVariables = {
  id: string;
};

export type DeleteCascadeAlbumMutation = {
  deleteCascadeAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type CreateTrackMutationVariables = {
  input: CreateTrackInput;
};

export type CreateTrackMutation = {
  createTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};

export type UpdateTrackMutationVariables = {
  albumId: string;
  id: string;
  input: UpdateTrackInput;
};

export type UpdateTrackMutation = {
  updateTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};

export type DeleteTrackMutationVariables = {
  albumId: string;
  id: string;
};

export type DeleteTrackMutation = {
  deleteTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};

export type RegisterServerMutationVariables = {
  input?: RegisterServerInput | null;
};

export type RegisterServerMutation = {
  registerServer?: {
    __typename: "Server";
    id: string;
    name: string;
    note?: string | null;
    apiUrl: string;
    headerUrl?: string | null;
    timestamp: number;
    banned?: boolean | null;
    userPoolId: string;
    clientId: string;
    region: string;
    idpUrl: string;
    identityPoolId: string;
  } | null;
};

export type DeleteServerMutationVariables = {
  id: string;
};

export type DeleteServerMutation = {
  deleteServer?: {
    __typename: "Server";
    id: string;
    name: string;
    note?: string | null;
    apiUrl: string;
    headerUrl?: string | null;
    timestamp: number;
    banned?: boolean | null;
    userPoolId: string;
    clientId: string;
    region: string;
    idpUrl: string;
    identityPoolId: string;
  } | null;
};

export type CreateServerInviteMutation = {
  createServerInvite?: {
    __typename: "CreateServerInviteResponse";
    id: string;
    timestamp: number;
    secret: string;
    clientIdUrl: string;
  } | null;
};

export type DeleteServerInviteMutationVariables = {
  id: string;
};

export type DeleteServerInviteMutation = {
  deleteServerInvite?: {
    __typename: "ServerInvite";
    id: string;
    timestamp: number;
  } | null;
};

export type CreateInviteMutationVariables = {
  input: CreateInviteInput;
};

export type CreateInviteMutation = {
  createInvite?: {
    __typename: "InviteUrl";
    claimUrl: string;
  } | null;
};

export type RevokeInviteMutationVariables = {
  id: string;
};

export type RevokeInviteMutation = {
  revokeInvite?: boolean | null;
};

export type MarkInviteUnsolicitedMutationVariables = {
  id: string;
};

export type MarkInviteUnsolicitedMutation = {
  markInviteUnsolicited?: boolean | null;
};

export type GetAlbumQueryVariables = {
  id: string;
};

export type GetAlbumQuery = {
  getAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
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
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type GetArtistQueryVariables = {
  id: string;
};

export type GetArtistQuery = {
  getArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
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
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
  } | null;
};

export type ListArtistsForAlbumQueryVariables = {
  id: string;
};

export type ListArtistsForAlbumQuery = {
  listArtistsForAlbum?: Array<{
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  }> | null;
};

export type GetTrackQueryVariables = {
  albumId: string;
  id: string;
};

export type GetTrackQuery = {
  getTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};

export type ListOrphanTracksQuery = {
  listOrphanTracks?: {
    __typename: "TrackConnection";
    items?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
  } | null;
};

export type ListServersQuery = {
  listServers?: {
    __typename: "ServerConnection";
    items?: Array<{
      __typename: "Server";
      id: string;
      name: string;
      note?: string | null;
      apiUrl: string;
      headerUrl?: string | null;
      timestamp: number;
      banned?: boolean | null;
      userPoolId: string;
      clientId: string;
      region: string;
      idpUrl: string;
      identityPoolId: string;
    }> | null;
  } | null;
};

export type ListServerInvitesQuery = {
  listServerInvites?: {
    __typename: "ServerInviteConnection";
    items?: Array<{
      __typename: "ServerInvite";
      id: string;
      timestamp: number;
    }> | null;
  } | null;
};

export type GetInviteQueryVariables = {
  id: string;
};

export type GetInviteQuery = {
  getInvite?: {
    __typename: "Invite";
    id: string;
    timestamp: number;
    note?: string | null;
    validity?: number | null;
    visited?: number | null;
    installed?: number | null;
    unsolicited?: number | null;
  } | null;
};

export type ListInvitesQueryVariables = {
  filter?: TableInviteFilterInput | null;
};

export type ListInvitesQuery = {
  listInvites?: {
    __typename: "InviteConnection";
    items?: Array<{
      __typename: "Invite";
      id: string;
      timestamp: number;
      note?: string | null;
      validity?: number | null;
      visited?: number | null;
      installed?: number | null;
      unsolicited?: number | null;
    }> | null;
  } | null;
};

export type OnCreateArtistSubscriptionVariables = {
  id?: string | null;
  name?: string | null;
};

export type OnCreateArtistSubscription = {
  onCreateArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type OnUpdateArtistSubscriptionVariables = {
  id?: string | null;
  name?: string | null;
};

export type OnUpdateArtistSubscription = {
  onUpdateArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type OnDeleteArtistSubscriptionVariables = {
  id?: string | null;
  name?: string | null;
};

export type OnDeleteArtistSubscription = {
  onDeleteArtist?: {
    __typename: "Artist";
    serverId: string;
    id: string;
    name?: string | null;
    imageUrl?: string | null;
    albums?: Array<{
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    }> | null;
  } | null;
};

export type OnCreateAlbumSubscriptionVariables = {
  id?: string | null;
  name?: string | null;
};

export type OnCreateAlbumSubscription = {
  onCreateAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type OnUpdateAlbumSubscriptionVariables = {
  id?: string | null;
  name?: string | null;
};

export type OnUpdateAlbumSubscription = {
  onUpdateAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type OnDeleteAlbumSubscriptionVariables = {
  id?: string | null;
  name?: string | null;
};

export type OnDeleteAlbumSubscription = {
  onDeleteAlbum?: {
    __typename: "Album";
    serverId: string;
    id: string;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    name?: string | null;
    imageUrl?: string | null;
    year?: number | null;
    volumes: number;
    tracks?: Array<{
      __typename: "Track";
      serverId: string;
      albumId: string;
      id: string;
      url: string;
      title?: string | null;
      info?: string | null;
      lengthInSeconds?: number | null;
      ordinal?: number | null;
      volume: number;
      side: number;
      hash: string;
      features?: Array<string> | null;
    }> | null;
    isVa?: boolean | null;
  } | null;
};

export type OnCreateTrackSubscriptionVariables = {
  id?: string | null;
  title?: string | null;
};

export type OnCreateTrackSubscription = {
  onCreateTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};

export type OnUpdateTrackSubscriptionVariables = {
  id?: string | null;
  title?: string | null;
};

export type OnUpdateTrackSubscription = {
  onUpdateTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};

export type OnDeleteTrackSubscriptionVariables = {
  id?: string | null;
  title?: string | null;
};

export type OnDeleteTrackSubscription = {
  onDeleteTrack?: {
    __typename: "Track";
    serverId: string;
    albumId: string;
    id: string;
    album?: {
      __typename: "Album";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      volumes: number;
      isVa?: boolean | null;
    } | null;
    artists?: Array<{
      __typename: "Artist";
      serverId: string;
      id: string;
      name?: string | null;
      imageUrl?: string | null;
    }> | null;
    url: string;
    title?: string | null;
    info?: string | null;
    lengthInSeconds?: number | null;
    ordinal?: number | null;
    volume: number;
    side: number;
    hash: string;
    features?: Array<string> | null;
  } | null;
};
