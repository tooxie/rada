#!/usr/bin/env python3
from datetime import datetime
import boto3
import hashlib
import json
import os
import random
import string
import uuid


def handler(event, context):
    print("event:", event)

    table_name = os.getenv("INVITATIONS_TABLE_NAME")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'INVITATIONS_TABLE_NAME'"))

    id = str(uuid.uuid4())
    time = int(datetime.now().timestamp())  # In seconds
    salt = salt_generator()
    seed = get_seed(id, time, salt)
    link = get_invite_link(id, time, salt)
    note = get_note(event)
    hash = hashlib.sha256(seed).hexdigest()
    validity = get_validity(event)  # In hours
    is_admin = get_is_admin(event)

    persist(table_name, id, time, hash, validity, note, is_admin)

    return json.dumps({ "claimUrl": link })


def persist(table_name, id, timestamp, hash, validity, note, is_admin):
    client = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": id,
        "timestamp": timestamp,
        "validity": validity,
        "hash": hash,
        "note": note,
        "isAdmin": is_admin,
        # "visited": <timestamp | None>,
        # "installed": <timestamp | None>,
        # "unsolicited": <timestamp | None>,
    }
    print("item:", item)
    client.put_item(Item=item)


SALT_CHARS=string.ascii_letters + string.digits
def salt_generator(size=24, chars=SALT_CHARS):
    return ''.join(random.choice(chars) for _ in range(size))


def get_note(event):
    return get_input(event, "note", None)


def get_is_admin(event):
    return get_input(event, "isAdmin", False)


def get_validity(event, default_validity=24):
    return get_input(event, "validity", default_validity)


def get_input(event, input_name, default_value):
    inputs = event.get("arguments", {}).get("input", {})
    return inputs.get(input_name, default_value)


def get_seed(id, ts, salt):
    return f"{id}${ts}${salt}".encode()


def get_invite_link(id, ts, salt):
    url = os.environ["PUBLIC_URL"]
    return f"{url}/invite/{id}/{ts}?s={salt}"


def error(e):
    return {
        "error": {
            "message": " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
