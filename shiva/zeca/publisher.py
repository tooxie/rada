#!/usr/bin/env python3
import configparser
import json
import os
import pathlib

from logger import get_logger

NULL_ID = "00000000-0000-0000-0000-000000000000"
log = get_logger("publisher")


def publish_artist(client, artist):
    if artist.gql_id:
        update_artist(client, artist)
    else:
        create_artist(client, artist)


def update_artist(client, artist):
    log.debug(f"[ARTIST] Updating artist \"{artist.name}\"...")
    query = """
mutation updateArtist(
    $id: ID!,
    $name: String!,
    $image: AWSURL,
) {
    updateArtist(
        id: $id,
        input: {
            name: $name,
            imageUrl: $image,
        }
    ) {
        id
    }
}"""

    execute_artist_mutation(client, artist, query)


def create_artist(client, artist):
    log.debug(f"[ARTIST] Publishing \"{artist.name}\"...")
    query = """
mutation createArtist(
    $name: String!,
    $image: AWSURL,
) {
    createArtist(input: {
        name: $name,
        imageUrl: $image,
    }) {
        id
    }
}"""

    execute_artist_mutation(client, artist, query)


def execute_artist_mutation(client, artist, query):
    variables = {"name": artist.name}
    if artist.gql_id:
        variables.update({"id": artist.gql_id})
    if artist.image:
        variables.update({"image": artist.image})
    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        raise Exception(response["errors"][0]["message"])

    if "createArtist" in response["data"]:
        item = response['data']['createArtist']
        artist.gql_id = item['id']
        log.info("[ARTIST] [PUBLISHED] %s (%s)" % (artist.name, artist.gql_id))
    elif "updateArtist" in response["data"]:
        log.info("[ARTIST] [UPDATE] %s (%s)" % (artist.name, artist.gql_id))


def publish_album(client, album, artists):
    if album.gql_id:
        update_album(client, album, artists)
    else:
        create_album(client, album, artists)

def update_album(client, album, artists):
    log.debug(f"[ALBUM] Updating album \"{album.name}\"...")
    query = """
mutation updateAlbum(
    $id: ID!,
    $name: String!,
    $cover: AWSURL,
    $year: Int,
    $volumes: Int,
) {
    updateAlbum(
        id: $id,
        input: {
            name: $name,
            imageUrl: $cover,
            year: $year,
            volumes: $volumes,
        }
    ) {
        id
    }
}"""
    execute_album_mutation(client, album, artists, query)


def create_album(client, album, artists):
    log.debug(f"[ALBUM] Publishing \"{album.name}\"...")
    query = """
mutation createAlbum(
    $artists: [ID!]!,
    $name: String!,
    $cover: AWSURL,
    $year: Int,
    $volumes: Int!,
) {
    createAlbum(input: {
        artists: $artists,
        name: $name,
        imageUrl: $cover,
        year: $year,
        volumes: $volumes,
    }) {
        id
    }
}"""

    execute_album_mutation(client, album, artists, query)


def execute_album_mutation(client, album, artists, query):
    variables = {
        "artists": [artist.gql_id for artist in artists],
        "name": album.name,
    }
    if album.gql_id:
        variables.update({"id": album.gql_id})
    for attr in ["year", "cover", "volumes"]:
        if hasattr(album, attr):
            val = album.__getattribute__(attr)
            variables.update({attr: val})
    log.debug(query, variables)
    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        raise Exception(response["errors"][0]["message"])

    if "createAlbum" in response["data"]:
        item = response["data"]['createAlbum']
        album.gql_id = item['id']
        log.info("[ALBUM] [PUBLISH] %s (%s)" % (album.name, album.gql_id))
    elif "updateAlbum" in response["data"]:
        log.info("[ALBUM] [UPDATE] %s (%s)" % (album.name, album.gql_id))


def publish_track(client, track, album=None):
    if track.gql_id:
        update_track(client, track, album)
    else:
        create_track(client, track, album)


def update_track(client, track, album=None):
    log.debug("Track publised already, ignoring")
    query = """
mutation updateTrack(
    $albumId: ID!,
    $id: ID!,
    $url: AWSURL,
    $hash: String,
    $title: String,
    $length: Int,
    $ordinal: Int,
    $volume: Int,
    $side: Int,
    $artists: [ID!],
    $path: String,
) {
    updateTrack(
        albumId: $albumId,
        id: $id,
        input: {
            url: $url,
            hash: $hash,
            title: $title,
            lengthInSeconds: $length,
            ordinal: $ordinal,
            volume: $volume,
            side: $side,
            artists: $artists,
            path: $path,
        }
    ) {
        id
        title
    }
}"""

    execute_track_mutation(client, track, album, query)


def expand(path: str) -> str:
    return os.path.expandvars(os.path.expanduser(path))


def get_music_dir():
    dirname = os.path.dirname(__file__)
    config_path = os.path.join(dirname, "../gawshi.conf")
    config = configparser.ConfigParser()
    config.read(config_path)

    old_cwd = os.getcwd()
    os.chdir(os.path.join(os.path.dirname(__file__), ".."))
    music_dir = os.path.abspath(config.get('gawshi', 'music_dir'))
    os.chdir(old_cwd)

    return music_dir


def create_track(client, track, album=None):
    music_dir = get_music_dir()
    path = pathlib.Path(track.path).relative_to(music_dir)
    log.debug(f"[TRACK] Publishing \"{path}\"...")
    query = """
mutation createTrack(
    $albumId: ID!,
    $url: AWSURL!,
    $hash: String!,
    $title: String,
    $length: Int,
    $ordinal: Int,
    $volume: Int!,
    $side: Int!,
    $artists: [ID!],
    $path: String!,
) {
    createTrack(input: {
        albumId: $albumId,
        url: $url,
        hash: $hash,
        title: $title,
        lengthInSeconds: $length,
        ordinal: $ordinal,
        volume: $volume,
        side: $side,
        artists: $artists,
        path: $path,
    }) {
        id
        title
    }
}"""

    execute_track_mutation(client, track, album, query)


def execute_track_mutation(client, track, album, query):
    music_dir = get_music_dir()
    path = str(pathlib.Path(track.path).relative_to(music_dir))
    artists = map(lambda a: a.gql_id, track.artists)
    not_none = lambda a: a
    variables = {
        "albumId": album.gql_id if album else f"album:{NULL_ID}",
        "url": track.url,
        "hash": track.hash,
        "title": track.title,
        "length": track.length,
        "ordinal": track.ordinal,
        "volume": track.volume or 0,
        "side": track.side or 0,
        "artists": list(filter(not_none, artists)),
        "path": path,
    }
    if track.gql_id:
        variables.update({
            "id": track.gql_id,
        })

    if len(list(filter(lambda a: a is None, artists))) > 0:
        log.info(f"Track \"{track.id}\" has null artists", track.artists)

    response = json.loads(client.execute(query, variables))
    if 'errors' in response:
        log.debug(query)
        log.debug(variables)
        raise Exception(response["errors"][0]["message"])

    if "createTrack" in response["data"]:
        item = response["data"]['createTrack']
        track.gql_id = item['id']
        log.info("[TRACK] [PUBLISH] %s (%s)" % (track.title, track.gql_id))
    elif "updateTrack" in response["data"]:
        log.info("[TRACK] [UPDATE] %s (%s)" % (track.title, track.gql_id))
