import gql from 'graphql-tag';
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAlbum = gql`
  mutation CreateAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
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
export const updateAlbum = gql`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
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
export const deleteAlbum = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id) {
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
export const createArtist = gql`
  mutation CreateArtist($input: CreateArtistInput!) {
    createArtist(input: $input) {
      id
      name
      imageUrl
      albums {
        nextToken
      }
    }
  }
`;
export const updateArtist = gql`
  mutation UpdateArtist($id: ID!, $input: UpdateArtistInput!) {
    updateArtist(id: $id, input: $input) {
      id
      name
      imageUrl
      albums {
        nextToken
      }
    }
  }
`;
export const deleteArtist = gql`
  mutation DeleteArtist($id: ID!) {
    deleteArtist(id: $id) {
      id
      name
      imageUrl
      albums {
        nextToken
      }
    }
  }
`;
export const createPlaylist = gql`
  mutation CreatePlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      id
      name
      imageUrl
    }
  }
`;
export const updatePlaylist = gql`
  mutation UpdatePlaylist($id: ID!, $input: UpdatePlaylistInput!) {
    updatePlaylist(id: $id, input: $input) {
      id
      name
      imageUrl
    }
  }
`;
export const deletePlaylist = gql`
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id) {
      id
      name
      imageUrl
    }
  }
`;
export const createTrack = gql`
  mutation CreateTrack($input: CreateTrackInput!) {
    createTrack(input: $input) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
export const updateTrack = gql`
  mutation UpdateTrack($id: ID!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
export const deleteTrack = gql`
  mutation DeleteTrack($id: ID!) {
    deleteTrack(id: $id) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
