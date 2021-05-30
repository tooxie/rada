import gql from 'graphql-tag';
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
      title
      coverUrl
      tracks {
        nextToken
      }
    }
  }
`;
export const listAlbums = gql`
  query ListAlbums(
    $filter: TableAlbumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        coverUrl
      }
      nextToken
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
        nextToken
      }
    }
  }
`;
export const listArtists = gql`
  query ListArtists(
    $filter: TableArtistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArtists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        imageUrl
      }
      nextToken
    }
  }
`;
export const getPlaylist = gql`
  query GetPlaylist($id: ID!) {
    getPlaylist(id: $id) {
      id
      name
      imageUrl
    }
  }
`;
export const listPlaylists = gql`
  query ListPlaylists(
    $filter: TablePlaylistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlaylists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        imageUrl
      }
      nextToken
    }
  }
`;
export const getTrack = gql`
  query GetTrack($id: ID!) {
    getTrack(id: $id) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
export const listTracks = gql`
  query ListTracks(
    $filter: TableTrackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTracks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        albumId
        title
        lengthInSeconds
      }
      nextToken
    }
  }
`;
