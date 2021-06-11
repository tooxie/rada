import gql from "graphql-tag";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createArtist = gql`
  mutation CreateArtist($input: CreateArtistInput!) {
    createArtist(input: $input) {
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
export const updateArtist = gql`
  mutation UpdateArtist($id: ID!, $input: UpdateArtistInput!) {
    updateArtist(id: $id, input: $input) {
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
export const deleteArtist = gql`
  mutation DeleteArtist($id: ID!) {
    deleteArtist(id: $id) {
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
export const deleteCascadeArtist = gql`
  mutation DeleteCascadeArtist($id: ID!) {
    deleteCascadeArtist(id: $id) {
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
export const createAlbum = gql`
  mutation CreateAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
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
        lengthInSeconds
        ordinal
        hash
        features
      }
      isVa
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
      name
      imageUrl
      year
      tracks {
        id
        url
        title
        lengthInSeconds
        ordinal
        hash
        features
      }
      isVa
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
      name
      imageUrl
      year
      tracks {
        id
        url
        title
        lengthInSeconds
        ordinal
        hash
        features
      }
      isVa
    }
  }
`;
export const deleteCascadeAlbum = gql`
  mutation DeleteCascadeAlbum($id: ID!) {
    deleteCascadeAlbum(id: $id) {
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
        lengthInSeconds
        ordinal
        hash
        features
      }
      isVa
    }
  }
`;
export const createTrack = gql`
  mutation CreateTrack($input: CreateTrackInput!) {
    createTrack(input: $input) {
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
      lengthInSeconds
      ordinal
      hash
      features
    }
  }
`;
export const updateTrack = gql`
  mutation UpdateTrack($id: ID!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
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
      lengthInSeconds
      ordinal
      hash
      features
    }
  }
`;
export const deleteTrack = gql`
  mutation DeleteTrack($id: ID!) {
    deleteTrack(id: $id) {
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
      lengthInSeconds
      ordinal
      hash
      features
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
export const addToPlaylist = gql`
  mutation AddToPlaylist($id: ID!, $targetId: ID!) {
    addToPlaylist(id: $id, targetId: $targetId)
  }
`;
export const removeFromPlaylist = gql`
  mutation RemoveFromPlaylist($id: ID!, $targetId: ID!) {
    removeFromPlaylist(id: $id, targetId: $targetId)
  }
`;
export const addToFavorites = gql`
  mutation AddToFavorites($id: ID!) {
    addToFavorites(id: $id)
  }
`;
export const removeFromFavorites = gql`
  mutation RemoveFromFavorites($id: ID!) {
    removeFromFavorites(id: $id)
  }
`;
export const createInvite = gql`
  mutation CreateInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      claimUrl
    }
  }
`;
export const revokeInvite = gql`
  mutation RevokeInvite($id: ID!) {
    revokeInvite(id: $id)
  }
`;
export const markInviteUnsolicited = gql`
  mutation MarkInviteUnsolicited($id: ID!) {
    markInviteUnsolicited(id: $id)
  }
`;
