#!/usr/bin/env python3
from boto3.dynamodb.conditions import Key
import boto3
import json
import os


class NoArtistsFoundError(RuntimeError):
    pass


def handler(event, _):
    print(event)
    table_name = os.getenv("DYNAMODB_ARTISTS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_ARTISTS_TABLE'"))

    index_name = os.getenv("DYNAMODB_INDEX_NAME")
    if not index_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_INDEX_NAME'"))

    try:
        client = boto3.resource('dynamodb')
    except Exception as e:
        return error(e)

    try:
        album_id = get_album_id(event)
    except KeyError:
        return error(RuntimeError("Album ID not provided"))

    try:
        artists = get_artists_for_album(client, table_name, index_name, album_id)
        print(artists)
    except NoArtistsFoundError:
        return json.dumps([])

    try:
        response = json.dumps(batch_get_artists(client, table_name, artists))
        print(response)
        return response
    except Exception as e:
        return error(e)


def get_artists_for_album(client, table_name, index_name, album_id):
    print(f"Trying to get artists for album '{album_id}'")
    expr = Key("id").eq(album_id) & Key("adjacentId").begins_with("artist:")
    response = client.Table(table_name).query(
        IndexName=index_name,
        KeyConditionExpression=expr,
        ProjectionExpression="adjacentId",
    )

    print(response)
    if response["Count"] == 0:
        raise NoArtistsFoundError(f"No artists found for album '{album_id}'")

    return [ artist["adjacentId"] for artist in response["Items"] ]


def batch_get_artists(client, table_name, artists):
    print(f"Batch getting artists: {artists}")
    keys = [ {
        "adjacentId": "artist:",
        "id": artist_id,
    } for artist_id in artists ]
    print(keys)
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


def get_album_id(event):
    return event["source"]["id"]
