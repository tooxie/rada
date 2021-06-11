#!/usr/bin/env python3
import boto3
import json
import os


class ArtistNotFoundError(RuntimeError):
    pass


# We should turn this into a trivial velocity get operation rather than a
# lambda. Lambdas are notably slow compared to the velocity templates.
def handler(event, _):
    print(event)
    table_name = os.getenv("DYNAMODB_ARTISTS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_ARTISTS_TABLE'"))

    try:
        artist_id = get_artist_id(event)
    except KeyError:
        return error(RuntimeError("Artist ID not provided"))

    try:
        return get_artist(table_name, artist_id)
    except Exception as e:
        return error(e)


def get_artist(table_name, artist_id):
    dyn = boto3.resource('dynamodb').Table(table_name)
    print(f"Trying to get artist '{artist_id}'")
    response = dyn.get_item(Key={
        "adjacentId": "artist:",
        "id": artist_id,
    })

    if "Item" not in response:
        raise ArtistNotFoundError(f"Artist '{artist_id}' not found")

    body = json.dumps(response["Item"])
    print(body)

    return body


def error(e):
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }


def get_artist_id(event):
    return event["arguments"]["id"]
