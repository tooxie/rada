import gql from "graphql-tag";

export const getAlbum = gql`
  query GetAlbumOnly($id: ID!) {
    getAlbum(id: $id) {
      id
      name
      imageUrl
      year
      isVa
    }
  }
`;

// FIXME: This query is highly redundant, can (and should be) optimized.
export const getAlbumWithTracks = gql`
  query GetAlbumWithTracks($id: ID!) {
    getAlbum(id: $id) {
      id
      name
      imageUrl
      year
      isVa
      artists {
        id
        name
      }
      tracks {
        id
        url
        title
        lengthInSeconds
        ordinal
        hash
        features
        artists {
          id
          name
        }
        album {
          id
          name
          imageUrl
          isVa
        }
      }
    }
  }
`;

export const getArtist = gql`
  query GetArtistInAlbum($id: ID!) {
    getArtist(id: $id) {
      id
      name
      imageUrl
      albums {
        id
        name
        imageUrl
        year
        artists {
          id
        }
      }
    }
  }
`;

export const listAlbumsWithArtists = gql`
  query ListAlbumsWithArtists($filter: TableAlbumFilterInput) {
    listAlbums(filter: $filter) {
      items {
        id
        name
        imageUrl
        year
        isVa
        artists {
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
        id
        albums {
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
