import gql from "graphql-tag";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = gql`
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
      id
      artists {
        id
        name
        imageUrl
      }
      name
      imageUrl
      year
      tracks {
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
      id
      name
      imageUrl
      albums {
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
      id
      name
      imageUrl
      albums {
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
      id
      album {
        id
        name
        imageUrl
        year
        isVa
      }
      artists {
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
export const listTracks = gql`
  query ListTracks($filter: TableTrackFilterInput) {
    listTracks(filter: $filter) {
      items {
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
