import gql from "graphql-tag";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = gql`
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
      serverId
      id
      artists {
        serverId
        id
        name
        imageUrl
      }
      name
      imageUrl
      year
      tracks {
        serverId
        id
        url
        title
        info
        lengthInSeconds
        ordinal
        hash
        features
      }
      isVa
    }
  }
`;
export const listAlbums = gql`
  query ListAlbums($filter: TableAlbumFilterInput) {
    listAlbums(filter: $filter) {
      items {
        serverId
        id
        name
        imageUrl
        year
        isVa
      }
    }
  }
`;
export const getArtist = gql`
  query GetArtist($id: ID!) {
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
        isVa
      }
    }
  }
`;
export const listArtists = gql`
  query ListArtists($filter: TableArtistFilterInput) {
    listArtists(filter: $filter) {
      items {
        serverId
        id
        name
        imageUrl
      }
    }
  }
`;
export const listArtistsForAlbum = gql`
  query ListArtistsForAlbum($id: ID!) {
    listArtistsForAlbum(id: $id) {
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
        isVa
      }
    }
  }
`;
export const getTrack = gql`
  query GetTrack($albumId: ID!, $id: ID!) {
    getTrack(albumId: $albumId, id: $id) {
      serverId
      id
      album {
        serverId
        id
        name
        imageUrl
        year
        isVa
      }
      artists {
        serverId
        id
        name
        imageUrl
      }
      url
      title
      info
      lengthInSeconds
      ordinal
      hash
      features
    }
  }
`;
export const listOrphanTracks = gql`
  query ListOrphanTracks {
    listOrphanTracks {
      items {
        serverId
        id
        url
        title
        info
        lengthInSeconds
        ordinal
        hash
        features
      }
    }
  }
`;
export const listServers = gql`
  query ListServers {
    listServers {
      items {
        id
        name
        note
        apiUrl
        headerUrl
        timestamp
        banned
        handshakeCompleted
      }
    }
  }
`;
export const getInvite = gql`
  query GetInvite($id: ID!) {
    getInvite(id: $id) {
      id
      timestamp
      note
      validity
      visited
      installed
      unsolicited
    }
  }
`;
export const listInvites = gql`
  query ListInvites($filter: TableInviteFilterInput) {
    listInvites(filter: $filter) {
      items {
        id
        timestamp
        note
        validity
        visited
        installed
        unsolicited
      }
    }
  }
`;
