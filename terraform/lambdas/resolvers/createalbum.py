#!/usr/bin/env python3
import boto3
import json
import os
import uuid
import string


def slugify(s):
    return s.lower()


def handler(event, _):
    print(event)
    table_name = os.getenv("DYNAMODB_ALBUMS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_ALBUMS_TABLE'"))

    try:
        artists = get_artists(event)
    except Exception as e:
        return error(e)

    album = {
        "adjacentId": "album:",
        "id": f"album:{str(uuid.uuid4())}",
    }
    try:
        album.update(get_album_attributes(event))
    except Exception as e:
        return error(e)

    try:
        return create_album(table_name, artists, album)
    except Exception as e:
        return error(e)


def create_album(table_name, artists, album):
    dynamodb = boto3.resource('dynamodb').Table(table_name)

    with dynamodb.batch_writer() as batch:
        for artist_id in artists:
            if not artist_exists(dynamodb, artist_id):
                raise RuntimeError(f"Artist {artist_id} does not exist")
            artist = {
                "adjacentId": artist_id,
                "id": album["id"],
            }
            print(artist)
            batch.put_item(Item=artist)
        print(album)
        batch.put_item(Item=album)

    return json.dumps(album)


def error(e):
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }


def artist_exists(dynamodb, artist_id):
    response = dynamodb.get_item(Key={
        "adjacentId": "artist:",
        "id": artist_id,
    })
    print(response)
    return "Item" in response


def get_artists(event):
    return event["arguments"]["input"]["artists"]


def get_album_attributes(event):
    attrs = {"isVa": False}
    ignored = ["artists"]
    item = event["arguments"]["input"]
    for attr in item:
        if attr not in ignored:
            if attr == 'name':
                attrs.update({
                    'name': item[attr],
                    'slug': slugify(item[attr]),
                })
            else:
                attrs.update({attr: item[attr]})

    if "artists" in item:
        artists = item["artists"]
        if artists:
            attrs.update({"isVa": len(artists) > 1})

    return attrs
