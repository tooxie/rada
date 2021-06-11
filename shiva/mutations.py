#!/usr/bin/env python3
def create_artist():
    return """
mutation createArtist($name: String!, $image: AWSURL) {
    createArtist(input: {name: $name, imageUrl: $image}) {
        id
        name
    }
}"""

def create_album():
    return """
mutation createAlbum(
    $artists: [ID!]!,
    $name: String!,
    $cover: AWSURL,
    $year: Int,
) {
    createAlbum(input: {
        artists: $artists,
        name: $name,
        imageUrl: $cover,
        year: $year,
    }) {
        id
        name
        year
    }
}"""

def create_track():
    return """
mutation createTrack(
    $album: ID!,
    $title: String!,
    $length: Int,
    $ordinal: Int,
) {
    createTrack(input: {
        albumId: $album,
        title: $title,
        lengthInSeconds: $length,
        ordinal: $ordinal,
    }) {
        id
        title
        lengthInSeconds
        ordinal
    }
}
"""
