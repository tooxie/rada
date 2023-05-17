#!/usr/bin/env python3
"""
Mutation createServerInvite resolver

This resolver generates an entry in the server invitations table while we wait
for the server-to-server-handshake to finish. Conceptually it's similar to the
friend invitations, but does not have the extra salt/hash security layer.
That's because this flow requires both parties to sync before giving access to
a server, unlike friends which can access the DB immediately after scanning the
QR code. Also, the validity for a server invite is fixed to 1 hour.
"""
from datetime import datetime
import boto3
import json
import os
import random
import string
import uuid


def handler(event, _):
    print("event:", event)

    table_name = os.getenv("SERVER_INVITATIONS_TABLE_NAME")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'SERVER_INVITATIONS_TABLE_NAME'"))

    user_pool_id = os.getenv("USER_POOL_ID")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'USER_POOL_ID'"))

    client_id_url = os.getenv("GET_CLIENT_ID_URL")
    if not client_id_url:
        return error(RuntimeError("Missing environment variable 'GET_CLIENT_ID_URL'"))

    invite_id = str(uuid.uuid4())
    timestamp = int(datetime.now().timestamp())  # In seconds
    secret = generate_secret()

    try:
        invite = persist(table_name, invite_id, timestamp, secret)
    except Exception as e:
        print(e)
        return error(e)

    invite["timestamp"] = float(invite["timestamp"])
    invite["clientIdUrl"] = client_id_url

    payload = json.dumps(invite)
    print(payload)
    return payload


def persist(table_name, invite_id, timestamp, secret):
    print("Persisting invite to DB...")
    dynamodb = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": invite_id,
        "timestamp": timestamp,
        "secret": secret,
    }
    print("item:", item)
    dynamodb.put_item(Item=item)

    return item


def generate_secret(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


def error(e):
    print(e)
    return {
        "error": {
            "message": e.__class__.__name__ + ": " + " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
