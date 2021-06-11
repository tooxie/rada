#!/usr/bin/env python3
import json
import logging
import logging.config
import os

from logger import get_logger

NULL_ID = "00000000-0000-0000-0000-000000000000"
logger = get_logger("publisher")


# def get_logger():
#     # return logging.getLogger('process')
#     log_conf = '../logging.conf'
#     dirname = os.path.dirname(__file__)
#     logging.config.fileConfig(os.path.join(dirname, log_conf))
#
#     return logging.getLogger('process')


def publish_artist(client, artist):
    if artist.gql_id:
        return

    query = """
mutation createArtist($name: String!, $image: AWSURL) {
    createArtist(input: { name: $name, imageUrl: $image }) {
        id
    }
}"""
    variables = {"name": artist.name}
    if artist.image:
        variables.update({"image": artist.image})
    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        raise Exception(response["errors"][0]["message"])

    item = response['data']['createArtist']
    artist.gql_id = item['id']
    logger.info("[ARTIST] [PUBLISHED] %s (%s)" % (artist.name, artist.gql_id))
    # logger.info('[PUBLISH] Artist "%s" published with id "artist:%s"' % (
    #     artist.name, artist.pk))


# def get_albums_for_artist(client, artist):
#     if not artist.gql_id:
#         return []
#
#     query = """
# query getArtist($artistId: ID!) {
#     getArtist(id: $artistId) {
#         id
#         name
#         albums {
#             id
#             name
#         }
#     }
# }"""
#     variables = {"artistId": artist.gql_id}
#     print(f"Getting artist {artist.gql_id}")
#     response = json.loads(client.execute(query, variables))
#     if 'errors' in response:
#         raise Exception(response["errors"][0]["message"])
#
#     print(response)
#     data = response['data']['getArtist']
#     if data and 'albums' in data and data['albums']:
#         return data['albums']
#
#     logger.debug("No albums")
#     return []


def publish_album(client, album, artists):
    if album.gql_id:
        logger.debug(f"[ALBUM] '{album.name}' publised already, ignoring")
        return

    # logger.debug("Searching for album")
    # for _album in get_albums_for_artist(client, artists[0]):
    #     if _album['name'] == album.name:
    #         logger.debug("found!")
    #         album.gql_id = _album['id']
    #         return

    query = """
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
    }
}"""
    variables = {
        "artists": [artist.gql_id for artist in artists],
        "name": album.name,
    }
    if album.year:
        variables.update({"year": album.year})
    if album.cover:
        variables.update({"cover": album.cover})
    print(variables)
    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        raise Exception(response["errors"][0]["message"])
    item = response["data"]['createAlbum']
    album.gql_id = item['id']

    logger.info('[PUBLISH] Album "%s" published with id "%s"' % (
        album.name, album.gql_id))


def get_tracks_for_album(client, album):
    logger.debug("Getting tracks for %s" % album.name)
    if not album.gql_id:
        return []

    query = """
query getAlbum($albumId: ID!) {
    getAlbum(id: $albumId) {
        id
        name
        tracks {
            id
            title
        }
    }
}"""
    variables = {"albumId": album.gql_id}
    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        raise Exception(response["errors"][0]["message"])

    data = response['data']['getAlbum']
    if 'tracks' in data:
        return data['tracks']

    logger.debug("No tracks")
    return []


def not_none(x):
    return x is not None


def publish_track(client, track, album=None):
    if track.gql_id:
        logger.debug("Track publised already, ignoring")
        return

    album_id = f"album:{NULL_ID}"
    if album and album.gql_id:
        album_id = album.gql_id

    artists = map(lambda a: a.gql_id, track.artists)
    query = """
mutation createTrack(
    $albumId: ID!,
    $url: AWSURL!,
    $hash: String!,
    $title: String,
    $length: Int,
    $ordinal: Int,
    $artists: [ID!],
) {
    createTrack(input: {
        albumId: $albumId,
        url: $url,
        hash: $hash,
        title: $title,
        lengthInSeconds: $length,
        ordinal: $ordinal,
        artists: $artists,
    }) {
        id
        title
    }
}"""
    variables = {
        "albumId": album_id,
        "url": track.url,
        "hash": track.hash,
        "title": track.title,
        "length": track.length,
        "ordinal": track.ordinal,
        "artists": list(filter(not_none, artists)),
    }

    if (len(list(artists)) != len(list(filter(not_none, artists)))):
        print(f"Track {track.id} has null artists", track.artists)

    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        raise Exception(response["errors"][0]["message"])

    item = response["data"]['createTrack']
    track.gql_id = item['id']

    logger.info('[PUBLISH] Track "%s" published with id "track:%s"' % (
        track.title, track.pk))
