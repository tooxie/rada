import gql from "graphql-tag";

export const getAlbum = gql`
  query GetAlbumOnly($id: ID!) {
    getAlbum(id: $id) {
      serverId
      id
      name
      imageUrl
      year
      isVa
      tracks {
        id
      }
    }
  }
`;

// I understand that this query is extremely inefficient, but it's necessary
// until the player gets refactored. Why? Because the player stores the tracks
// in LocalStorage, not as an album but as a list of tracks. Therefore each
// track has to have an album and an artist associated with it. In the future
// we should make the player smarter, so that it can store an album object and
// query the rest of the data. But for now, this is what we have ¯\_(ツ)_/¯
export const getAlbumWithTracks = gql`
  query GetAlbumWithTracks($id: ID!) {
    getAlbum(id: $id) {
      serverId
      id
      name
      imageUrl
      year
      volumes
      isVa
      artists {
        serverId
        id
        name
      }
      tracks {
        serverId
        id
        url
        title
        info
        lengthInSeconds
        ordinal
        volume
        side
        hash
        features
        artists {
          serverId
          id
          name
        }
        album {
          serverId
          id
          name
          imageUrl
          isVa
          volumes
        }
      }
    }
  }
`;

export const getArtist = gql`
  query GetArtistInAlbum($id: ID!) {
    getArtist(id: $id) {
      serverId
      id
      name
      imageUrl
      albums {
        serverId
        id
        name
        imageUrl
        year
        volumes
        isVa
      }
    }
  }
`;

export const listAlbumsWithArtists = gql`
  query ListAlbumsWithArtists($filter: TableAlbumFilterInput) {
    listAlbums(filter: $filter) {
      items {
        serverId
        id
        name
        imageUrl
        year
        isVa
        artists {
          serverId
          id
          name
        }
      }
    }
  }
`;

export type ListAlbumsQuery = {
  listAlbums?: {
    __typename: "AlbumConnection";
    items?: Array<{
      __typename: "Album";
      id: string;
      name?: string | null;
      imageUrl?: string | null;
      year?: number | null;
      artists?: Array<{
        __typename: "Artist";
        id: string;
        name?: string | null;
        imageUrl?: string | null;
      }> | null;
    }> | null;
  } | null;
};

export const listArtists = gql`
  query ListArtistsWithAlbums($filter: TableArtistFilterInput) {
    listArtists(filter: $filter) {
      items {
        serverId
        id
        albums {
          serverId
          id
          name
          imageUrl
        }
        name
      }
    }
  }
`;

export type ListArtistsQuery = {
  listArtists?: {
    __typename: "ArtistConnection";
    items?: Array<{
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
    }> | null;
  } | null;
};
