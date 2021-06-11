#!/usr/bin/env python3
from datetime import datetime
import boto3
import hashlib
import json
import logging
import os
import random
import string
import uuid


def handler(event, context):
    print("event:", event)

    table_name = os.environ["INVITATIONS_TABLE_NAME"]
    validity = get_validity(event)  # In hours
    id = str(uuid.uuid4())
    time = int(datetime.now().timestamp())
    salt = salt_generator()
    seed = get_seed(id, time, salt)
    link = get_invite_link(id, time, salt)
    note = get_note(event)
    hash = hashlib.sha256(seed).hexdigest()

    persist(table_name, id, time, hash, validity, note)

    return {
        "statusCode": 200,
        "body": link,
    }


def persist(table_name, id, timestamp, hash, validity, note):
    client = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": id,
        "timestamp": timestamp,
        "validity": validity,
        "hash": hash,
        "note": note,
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
    qs = event.get("queryStringParameters", {})
    if qs:
        return qs.get("note")


def get_validity(event, default_validity=24):
    qs = event.get("queryStringParameters", {})
    if qs:
        return qs.get("validity", default_validity)

    return default_validity


def get_public_url(event):
    return os.environ.get("APP_PUBLIC_URL")


def get_seed(id, ts, salt):
    return f"{id}${ts}${salt}".encode()


def get_invite_link(id, ts, salt):
    return f"/invite/{id}/{ts}?s={salt}"
