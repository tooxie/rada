#!/usr/bin/env python3
import base64
import json
import os
from threading import Thread

from graphqlclient import GraphQLClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import urllib3

from config import config
from discogs import Discogs
from enrich import enrich
from mutations import (create_artist, create_album,
    create_track)
import models as m

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
client = None
discogs = None


# Checking the integrity of a file at upload time:
# https://aws.amazon.com/it/premiumsupport/knowledge-center/data-integrity-s3/
# --content-md5 [BASE64_ENCODED_MD5] --metadata md5checksum=[BASE64_ENCODED_MD5]


def publish(db):
    for artist in db.query(m.Artist).all():
        if not artist.image:
            artist.image = get_artist_image(artist.name)
        put_artist(db, artist)
        for album in artist.albums:
            put_album(db, artist, album)
            for track in album.tracks:
                put_track(db, album, track)
                print('[OK] %s' % track.path)


def get_artist_image(name):
    artist = discogs.get_artist(name)
    if artist.images > 0:
        image = artist.images[0]
        if 'uri' in image:
            return image['uri']

    return None


def get_graphql_client(url, api_key):
    client = GraphQLClient(url.decode())
    client.inject_token(api_key.decode(), 'x-api-key')

    return client


def put_artist(db, artist):
    query = create_artist()
    variables = {"name": artist.name, "image": artist.image}
    response = json.loads(client.execute(query, variables))
    if ('errors' in response):
        raise Exception(response["errors"][0]["message"])
    item = response['data']['createArtist']
    artist.gql_id = item['id']
    db.add(artist)
    db.commit()


def put_album(db, artist, album):
    variables = {
        "artists": [artist.gql_id],
        "name": album.name,
        "cover": album.cover,
        "year": album.year,
    }
    query = create_album()
    response = json.loads(client.execute(query, variables))
    if ('errors' in response):
        raise Exception(response["errors"][0]["message"])
    item = response["data"]['createAlbum']
    album.gql_id = item['id']

    db.add(album)
    db.commit()


def put_track(db, album, track):
    variables = {
        "album": album.gql_id,
        "title": track.title,
        "length": track.length,
        "ordinal": track.ordinal,
    }
    response = json.loads(client.execute(create_track(), variables))
    if ('errors' in response):
        raise Exception(response["errors"][0]["message"])
    item = response["data"]["createTrack"]
    track.gql_id = item["id"]

    db.add(track)
    db.commit()


def get_db():
    engine = create_engine(config['DB_URL'])

    return Session(engine)


def get_graphql_config():
    dirname = os.path.dirname(__file__)
    graphql_config_path = os.path.join(dirname, config['GRAPHQL_CONFIG'])
    print(graphql_config_path)
    with open(graphql_config_path, 'r') as f:
        graphql_config = json.loads(f.read())
        graphql_config['ApiUrl'] = base64.b64decode(graphql_config['ApiUrl'])
        graphql_config['ApiKey'] = base64.b64decode(graphql_config['ApiKey'])

        return graphql_config


def get_package_json():
    dirname = os.path.dirname(__file__)
    package_json_path = os.path.join(dirname, '../client/package.json')
    with open(package_json_path, 'r') as f:
        package_json = json.loads(f.read())

        return package_json


def process(db, discogs):
    """
    It will spawn 4 different threads:
        * Enriching data (courtesy of Discogs)
        * Calculating md5 hashes
        * Uploading files to s3
        * Publishing the data to Gawshi

    Except for md5 they are all extremely I/O bound, spending most of their
    time waiting for network, that's why we opt for threading to process them.
    This leaves most of the CPU free for hashing.
    """

    prev_artist = None
    for artist in db.query(m.Track).one():
        enriching = Thread(target=enrich, name='enriching',
            args=(artist, discogs))
        enriching.start()

        hashing = Thread(target=hash, name='hashing', args=(artist,))
        hashing.start()

        # uploading = Thread(target=upload, name='uploading', args=(artist,))







        if prev_artist:
            publishing = threading.Thread(target=publish, name='publishing',
                args=(db,))
            publishing.start()
        if not artist.image:
            artist.image = get_artist_image(artist.name)
        put_artist(db, artist)
        for album in artist.albums:
            put_album(db, artist, album)
            for track in album.tracks:
                put_track(db, album, track)
                print('[OK] %s' % track.path)
        prev_artist = artist


def main():
    gqlconf = get_graphql_config()
    global client
    client = get_graphql_client(gqlconf['ApiUrl'], gqlconf['ApiKey'])

    global discogs
    pkg = get_package_json()
    discogs = Discogs(config['DISCOGS_TOKEN'], pkg['name'], pkg['version'])

    db = get_db()
    # publish(db)

    enriching = Thread(target=enrich, name='enriching', args=(db, discogs))
    enriching.start()

    hashing = Thread(target=hash, name='hashing', args=(db,))
    hashing.start()

    uploading = Thread(target=upload, name='uploading', args=(db,))
    uploading.start()

    publishing = Thread(target=publish, name='publishing', args=(db,))
    publishing.start()

if __name__ == '__main__':
    main()
