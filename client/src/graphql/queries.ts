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
  query ListPlaylists($filter: TablePlaylistFilterInput) {
    listPlaylists(filter: $filter) {
      items {
        id
        name
        imageUrl
      }
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
  query ListTracks($filter: TableTrackFilterInput) {
    listTracks(filter: $filter) {
      items {
        id
        albumId
        title
        lengthInSeconds
      }
    }
  }
`;
