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
    table_name = os.getenv("DYNAMODB_ARTISTS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_ARTISTS_TABLE'"))

    artist = {
        "adjacentId": "artist:",
        "id": f"artist:{str(uuid.uuid4())}",
    }
    try:
        artist.update(get_artist_attributes(event))
    except KeyError:
        return error(RuntimeError("No input provided"))

    try:
        return create_artist(table_name, artist)
    except Exception as e:
        return error(e)


def create_artist(table_name, artist):
    dyn = boto3.resource('dynamodb').Table(table_name)
    print(artist)
    dyn.put_item(Item=artist)

    return json.dumps(artist)


def get_artist_attributes(event):
    item = event["arguments"]["input"]
    attrs = {}
    for attr in item:
        if attr == 'name':
            attrs.update({
                'name': item[attr],
                'slug': slugify(item[attr]),
            })
        else:
            attrs.update({attr: item[attr]})

    return attrs


def error(e):
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
