#!/usr/bin/env python3
from datetime import datetime
import boto3
import json
import os


def handler(event, context):
    print("event:", event)

    table_name = os.getenv("SERVERS_TABLE_NAME")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'SERVERS_TABLE_NAME'"))

    server_id = get_server_id(event)
    if not server_id:
        return error(RuntimeError("No server ID provided"))

    api_url = get_api_url(event)
    if not api_url:
        return error(RuntimeError("No api URL provided"))

    idp_url = get_idp_url(event)
    if not idp_url:
        return error(RuntimeError("No IDP URL provided"))

    name = get_name(event)
    note = get_note(event)
    header_url = get_header_url(event)

    try:
        server = persist(table_name, server_id, name, note, api_url, idp_url, header_url)
    except:
        return error(RuntimeError("Server exists"))

    return json.dumps(server)


def persist(table_name, id, name, note, api_url, idp_url, header_url):
    client = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": id,
        "name": name,
        "note": note,
        "apiUrl": api_url,
        "idpUrl": idp_url,
        "headerUrl": header_url,
        "timestamp": int(datetime.now().timestamp()),
        "banned": False,
        "handshakeCompleted": False,
    }
    print("item:", item)
    client.put_item(
        Item=item,
        ConditionExpression="attribute_not_exists(id)"
    )

    return item


def get_input(event, input_name, default_value=None):
    inputs = event.get("arguments", {}).get("input", {})
    return inputs.get(input_name, default_value)


def get_name(event):
    return get_input(event, "name")


def get_note(event):
    return get_input(event, "note")


def get_server_id(event):
    return get_input(event, "id")


def get_header_url(event):
    return get_input(event, "headerUrl")


def get_api_url(event):
    return get_input(event, "apiUrl")


def get_idp_url(event):
    return get_input(event, "idpUrl")


def error(e):
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
