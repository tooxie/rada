#!/usr/bin/env python3
from boto3.dynamodb.conditions import Key
import boto3
import json
import os


class TrackNotFoundError(RuntimeError):
    pass


def handler(event, _):
    print(event)
    table_name = os.getenv("DYNAMODB_ARTISTS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_ARTISTS_TABLE'"))

    try:
        client = boto3.resource('dynamodb')
    except Exception as e:
        return error(e)

    try:
        artist_ids = get_artist_ids(event)
    except KeyError:
        return "[]"

    if not artist_ids:
        return "[]"

    try:
        artists = get_artists(client, table_name, artist_ids)
        print(artists)
        return json.dumps(artists)
    except Exception as e:
        return error(e)


def get_artists(client, table_name, artists):
    print(f"Batch getting artists: {artists}")
    keys = [ {
        "adjacentId": "artist:",
        "id": artist_id,
    } for artist_id in artists ]
    response = client.batch_get_item(
        RequestItems={ table_name: { "Keys": keys } }
    )

    return response["Responses"][table_name]


def error(e):
    print(e)
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }


def get_artist_ids(event):
    return event["source"]["artists"]
