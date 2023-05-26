#!/usr/bin/env python3
from decimal import Decimal
import boto3
import json
import os


class AlbumNotFoundError(RuntimeError):
    pass


# Could we turn this lambda into a pure velocity resolver?
def handler(event, _):
    print(event)
    table_name = os.getenv("DYNAMODB_ALBUMS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_ALBUMS_TABLE'"))

    try:
        album_id = get_album_id(event)
    except KeyError:
        return error(RuntimeError("Album ID not provided"))

    try:
        album = get_album(table_name, album_id)
    except Exception as e:
        return error(e)

    print(album)
    try:
        return json.dumps(album)
    except Exception as e:
        return error(e)


def get_album(table_name, album_id):
    dyn = boto3.resource('dynamodb').Table(table_name)
    print(f"Trying to get album '{album_id}'")
    response = dyn.get_item(Key={
        "adjacentId": "album:",
        "id": album_id,
    })

    if "Item" not in response:
        raise AlbumNotFoundError(f"Album '{album_id}' not found")

    item = response["Item"]
    for key in item:
        if isinstance(item[key], Decimal):
            if item[key] == 0:
                item[key] = None
            else:
                item[key] = int(item[key])

    return item


def error(e):
    body = {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
    print(f"[ERROR] {json.dumps(body)}")
    return body


def get_album_id(event):
    return event["arguments"]["id"]
