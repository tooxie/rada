#!/usr/bin/env python3
"""Enricher and publisher of locally indexed music to Gawshi"s API.

Usage:
    process [-h] [-q] [-u] [-v]

Options:
    -h, --help           Show this help message and exit
    -q, --quiet          Suppress warnings.
    -u, --update         Update existing items rather than ignoring them.
    -v, --verbose        Show debugging messages about the progress.
"""
import configparser
import hashlib
import json
import logging
import os
import sys
import boto3
import urllib

from docopt import docopt
from graphqlclient import GraphQLClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from discogs import Discogs
from logger import get_logger
from zeca.enricher import enrich
from zeca.publisher import publish_album, publish_artist, publish_track
from zeca.uploader import upload
import models as m

NULL_ID = "00000000-0000-0000-0000-000000000000"
log = get_logger("process")
config = None


def set_config():
    global config
    if not config:
        dirname = os.path.dirname(__file__)
        config_path = os.path.join(dirname, "./gawshi.conf")
        config = configparser.ConfigParser()
        config.read(config_path)


def get_credentials():
    return {
        "username": get_ssm_parameter(config.get("gawshi", "ssm_username")),
        "password": get_ssm_parameter(config.get("gawshi", "ssm_password")),
    }


def get_ssm_parameter(parameter_name):
    client = boto3.client('ssm', config.get("gawshi", "aws_region"))
    response = client.get_parameter(Name=parameter_name, WithDecryption=True)

    return response["Parameter"]["Value"]


def do_login(username, password):
    client = boto3.client('cognito-idp', config.get("gawshi", "aws_region"))
    client_id = config.get("gawshi", "cognito_client_id")

    response = client.initiate_auth(
        ClientId=client_id,
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": username,
            "PASSWORD": password,
        },
    )

    return response["AuthenticationResult"]["AccessToken"]


def get_graphql_client(endpoint, access_token):
    client = GraphQLClient(endpoint)
    client.inject_token(access_token)

    return client


def get_package_json():
    dirname = os.path.dirname(__file__)
    package_json_path = os.path.join(dirname, "../client/package.json")
    with open(package_json_path, "r") as f:
        package_json = json.loads(f.read())

        return package_json


def get_db():
    db_url = config.get("gawshi", "db_url")
    log.debug(f"DB URL: {db_url}")
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args)
    m.Base.metadata.create_all(engine)

    return Session(engine)


def process_track(track, bucket_name, bucket_url):
    if not track.hash:
        with open(track.path, "rb") as f:
            track.hash = hashlib.md5(f.read()).hexdigest()
    log.debug(f"[TRACK] Hash: {track.hash} ({track.title if track.title else '<no title>'})")

    log.debug(f"[TRACK] Old URL: {track.url}")
    if not track.url:
        track.url = upload(track, bucket_name, bucket_url)


def process(*, db, discogs, graphql, bucket_name, bucket_url, update):
    for artist in db.query(m.Artist).all():
        log.info(f"[ARTIST] {artist.name if artist.name else '<no name>'}")
        if artist.gql_id and not update:
            continue

        db.add(artist)

        if discogs and not artist.discogs_id:
            enrich(discogs, artist)

        publish_artist(graphql, artist)
        db.commit()

    for album in db.query(m.Album).all():
        log.info(f"[ALBUM] {album.name if album.name else '<no name>'}")
        if not album.gql_id or update:
            db.add(album)
            if discogs:
                artist = album.artists[0] if len(album.artists) else None
                enrich(discogs, artist, album)
            publish_album(graphql, album, artists=album.artists)
            db.commit()

        for track in album.tracks:
            log.info(f"[TRACK] {track.title if track.title else '<no title>'}")
            if track.gql_id and not update:
                continue

            db.add(track)
            process_track(track, bucket_name, bucket_url)
            publish_track(graphql, track, album=album)
            db.commit()

            log.debug(f"[TRACK] URL: {track.url}")

    for track in db.query(m.Track).filter(m.Track.album.is_(f"album:{NULL_ID}")):
        log.info(f"[TRACK] {track.title if track.title else '<no title>'}")
        if track.gql_id and not update:
            continue

        db.add(track)
        process_track(track, bucket_name, bucket_url)
        publish_track(graphql, track)
        db.commit()
        log.debug(f"[TRACK] URL: {track.url}")


def run(credentials, *, retries=0, update=False):
    if retries > 3:
        raise Exception("Too many retries")

    access_token = do_login(**credentials)
    api_url = config.get("gawshi", "graphql_api_url")
    graphql = get_graphql_client(api_url, access_token)

    discogs = None
    discogs_token = config.get("gawshi", "discogs_token")
    if discogs_token:
        pkg = get_package_json()
        discogs = Discogs(discogs_token, pkg["name"], pkg["version"])
        discogs.backoff_enabled = False

    db = get_db()
    bucket_name = config.get("gawshi", "bucket_name")
    bucket_url = config.get("gawshi", "bucket_url")

    try:
        process(
            db=db,
            discogs=discogs,
            graphql=graphql,
            bucket_name=bucket_name,
            bucket_url=bucket_url,
            update=update,
        )
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("Retrying...")
            db.close()
            run(credentials, retries + 1)
        else:
            raise
    except urllib.error.URLError as e:
        print(e)
        print("Retrying...")
        db.close()
        run(credentials, retries + 1)


def main():
    arguments = docopt(__doc__)

    if arguments["--quiet"]:
        log.setLevel(logging.ERROR)
    elif arguments["--verbose"]:
        log.setLevel(logging.DEBUG)
    else:
        log.setLevel(logging.INFO)

    set_config()
    credentials = get_credentials()

    try:
        run(credentials, update=arguments["--update"])
    except KeyboardInterrupt:
        log.info("Keyboard interrupt received, exiting...")
        sys.exit(1)

    # TODO: Print stats:
    # -> Number of DB records processed (artists + albums + tracks)
    # -> Number of files uploaded (and total size)
    # -> Average upload speed
    # print("Done.")


if __name__ == "__main__":
    main()
