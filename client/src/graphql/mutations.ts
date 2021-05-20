/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAlbum = /* GraphQL */ `
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
export const updateAlbum = /* GraphQL */ `
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
export const deleteAlbum = /* GraphQL */ `
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
export const createArtist = /* GraphQL */ `
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
export const updateArtist = /* GraphQL */ `
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
export const deleteArtist = /* GraphQL */ `
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
export const createPlaylist = /* GraphQL */ `
  mutation CreatePlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      id
      name
      imageUrl
    }
  }
`;
export const updatePlaylist = /* GraphQL */ `
  mutation UpdatePlaylist($id: ID!, $input: UpdatePlaylistInput!) {
    updatePlaylist(id: $id, input: $input) {
      id
      name
      imageUrl
    }
  }
`;
export const deletePlaylist = /* GraphQL */ `
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id) {
      id
      name
      imageUrl
    }
  }
`;
export const createTrack = /* GraphQL */ `
  mutation CreateTrack($input: CreateTrackInput!) {
    createTrack(input: $input) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
export const updateTrack = /* GraphQL */ `
  mutation UpdateTrack($id: ID!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
export const deleteTrack = /* GraphQL */ `
  mutation DeleteTrack($id: ID!) {
    deleteTrack(id: $id) {
      id
      albumId
      title
      lengthInSeconds
    }
  }
`;
