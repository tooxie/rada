/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateArtist = /* GraphQL */ `
  subscription OnCreateArtist($id: ID, $name: String) {
    onCreateArtist(id: $id, name: $name) {
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
export const onUpdateArtist = /* GraphQL */ `
  subscription OnUpdateArtist($id: ID, $name: String) {
    onUpdateArtist(id: $id, name: $name) {
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
export const onDeleteArtist = /* GraphQL */ `
  subscription OnDeleteArtist($id: ID, $name: String) {
    onDeleteArtist(id: $id, name: $name) {
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
export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum($id: ID, $name: String) {
    onCreateAlbum(id: $id, name: $name) {
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum($id: ID, $name: String) {
    onUpdateAlbum(id: $id, name: $name) {
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum($id: ID, $name: String) {
    onDeleteAlbum(id: $id, name: $name) {
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
export const onCreateTrack = /* GraphQL */ `
  subscription OnCreateTrack($id: ID, $title: String) {
    onCreateTrack(id: $id, title: $title) {
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
export const onUpdateTrack = /* GraphQL */ `
  subscription OnUpdateTrack($id: ID, $title: String) {
    onUpdateTrack(id: $id, title: $title) {
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
export const onDeleteTrack = /* GraphQL */ `
  subscription OnDeleteTrack($id: ID, $title: String) {
    onDeleteTrack(id: $id, title: $title) {
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
export const onCreatePlaylist = /* GraphQL */ `
  subscription OnCreatePlaylist($id: ID, $name: String) {
    onCreatePlaylist(id: $id, name: $name) {
      id
      name
      imageUrl
    }
  }
`;
export const onUpdatePlaylist = /* GraphQL */ `
  subscription OnUpdatePlaylist($id: ID, $name: String) {
    onUpdatePlaylist(id: $id, name: $name) {
      id
      name
      imageUrl
    }
  }
`;
export const onDeletePlaylist = /* GraphQL */ `
  subscription OnDeletePlaylist($id: ID, $name: String) {
    onDeletePlaylist(id: $id, name: $name) {
      id
      name
      imageUrl
    }
  }
`;
