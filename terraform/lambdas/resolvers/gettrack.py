#!/usr/bin/env python3
import boto3
import json
import os


class TrackNotFoundError(RuntimeError):
    pass


def handler(event, _):
    print(event)
    table_name = os.getenv("DYNAMODB_TRACKS_TABLE")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'DYNAMODB_TRACKS_TABLE'"))

    try:
        client = boto3.resource('dynamodb').Table(table_name)
    except Exception as e:
        return error(e)

    try:
        album_id = get_album_id(event)
    except KeyError:
        return error(RuntimeError(f"Album ID not provided: {event['source']}"))

    try:
        track_id = get_track_id(event)
    except KeyError:
        return error(RuntimeError(f"Track ID not provided: {event['source']}"))

    try:
        response = get_track(client, album_id, track_id)
        print(response)
        return json.dumps(response)
    except Exception as e:
        return error(e)


def get_track(client, album_id, track_id):
    print(f"Trying to get track '{track_id}'")
    response = client.get_item(Key={"albumId": album_id, "id": track_id})

    if "Item" not in response:
        raise TrackNotFoundError(f"Track '{track_id}' not found for album '{album_id}'")

    if "ordinal" in response["Item"]:
        if response["Item"]["ordinal"]:
            print("Converting ordinal to int")
            response["Item"]["ordinal"] = int(response["Item"]["ordinal"])
        else:
            response["Item"]["ordinal"] = None

    if "lengthInSeconds" in response["Item"]:
        if response["Item"]["lengthInSeconds"]:
            print("Converting lengthInSeconds to int")
            response["Item"]["lengthInSeconds"] = int(response["Item"]["lengthInSeconds"])
        else:
            response["Item"]["lengthInSeconds"] = None

    return response["Item"]


def error(e):
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }


def get_track_id(event):
    return event["arguments"]["id"]


def get_album_id(event):
    return event["arguments"]["albumId"]
