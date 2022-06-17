/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateArtist = /* GraphQL */ `
  subscription OnCreateArtist($id: ID, $name: String) {
    onCreateArtist(id: $id, name: $name) {
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
export const onUpdateArtist = /* GraphQL */ `
  subscription OnUpdateArtist($id: ID, $name: String) {
    onUpdateArtist(id: $id, name: $name) {
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
export const onDeleteArtist = /* GraphQL */ `
  subscription OnDeleteArtist($id: ID, $name: String) {
    onDeleteArtist(id: $id, name: $name) {
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
export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum($id: ID, $name: String) {
    onCreateAlbum(id: $id, name: $name) {
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum($id: ID, $name: String) {
    onUpdateAlbum(id: $id, name: $name) {
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum($id: ID, $name: String) {
    onDeleteAlbum(id: $id, name: $name) {
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
export const onCreateTrack = /* GraphQL */ `
  subscription OnCreateTrack($id: ID, $title: String) {
    onCreateTrack(id: $id, title: $title) {
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
export const onUpdateTrack = /* GraphQL */ `
  subscription OnUpdateTrack($id: ID, $title: String) {
    onUpdateTrack(id: $id, title: $title) {
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
export const onDeleteTrack = /* GraphQL */ `
  subscription OnDeleteTrack($id: ID, $title: String) {
    onDeleteTrack(id: $id, title: $title) {
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
