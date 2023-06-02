import gql from "graphql-tag";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createArtist = gql`
  mutation CreateArtist($input: CreateArtistInput!) {
    createArtist(input: $input) {
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
export const updateArtist = gql`
  mutation UpdateArtist($id: ID!, $input: UpdateArtistInput!) {
    updateArtist(id: $id, input: $input) {
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
export const deleteArtist = gql`
  mutation DeleteArtist($id: ID!) {
    deleteArtist(id: $id) {
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
export const deleteCascadeArtist = gql`
  mutation DeleteCascadeArtist($id: ID!) {
    deleteCascadeArtist(id: $id) {
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
export const createAlbum = gql`
  mutation CreateAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
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
      volumes
      tracks {
        serverId
        albumId
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
        path
      }
      isVa
    }
  }
`;
export const updateAlbum = gql`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
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
      volumes
      tracks {
        serverId
        albumId
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
        path
      }
      isVa
    }
  }
`;
export const deleteAlbum = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id) {
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
      volumes
      tracks {
        serverId
        albumId
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
        path
      }
      isVa
    }
  }
`;
export const deleteCascadeAlbum = gql`
  mutation DeleteCascadeAlbum($id: ID!) {
    deleteCascadeAlbum(id: $id) {
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
      volumes
      tracks {
        serverId
        albumId
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
        path
      }
      isVa
    }
  }
`;
export const createTrack = gql`
  mutation CreateTrack($input: CreateTrackInput!) {
    createTrack(input: $input) {
      serverId
      albumId
      id
      album {
        serverId
        id
        name
        imageUrl
        year
        volumes
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
      volume
      side
      hash
      features
      path
    }
  }
`;
export const updateTrack = gql`
  mutation UpdateTrack($albumId: ID!, $id: ID!, $input: UpdateTrackInput!) {
    updateTrack(albumId: $albumId, id: $id, input: $input) {
      serverId
      albumId
      id
      album {
        serverId
        id
        name
        imageUrl
        year
        volumes
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
      volume
      side
      hash
      features
      path
    }
  }
`;
export const deleteTrack = gql`
  mutation DeleteTrack($albumId: ID!, $id: ID!) {
    deleteTrack(albumId: $albumId, id: $id) {
      serverId
      albumId
      id
      album {
        serverId
        id
        name
        imageUrl
        year
        volumes
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
      volume
      side
      hash
      features
      path
    }
  }
`;
export const registerServer = gql`
  mutation RegisterServer($input: RegisterServerInput) {
    registerServer(input: $input) {
      id
      name
      note
      apiUrl
      headerUrl
      timestamp
      banned
      userPoolId
      clientId
      region
      idpUrl
      identityPoolId
    }
  }
`;
export const deleteServer = gql`
  mutation DeleteServer($id: ID!) {
    deleteServer(id: $id) {
      id
      name
      note
      apiUrl
      headerUrl
      timestamp
      banned
      userPoolId
      clientId
      region
      idpUrl
      identityPoolId
    }
  }
`;
export const createServerInvite = gql`
  mutation CreateServerInvite {
    createServerInvite {
      id
      timestamp
      secret
      clientIdUrl
    }
  }
`;
export const deleteServerInvite = gql`
  mutation DeleteServerInvite($id: ID!) {
    deleteServerInvite(id: $id) {
      id
      timestamp
    }
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
