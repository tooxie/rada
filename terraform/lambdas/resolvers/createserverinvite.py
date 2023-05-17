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
import uuid


def handler(event, _):
    print("event:", event)

    table_name = os.getenv("SERVER_INVITATIONS_TABLE_NAME")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'SERVER_INVITATIONS_TABLE_NAME'"))

    user_pool_id = os.getenv("USER_POOL_ID")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'USER_POOL_ID'"))

    secret_url = os.getenv("SECRET_URL")
    if not secret_url:
        return error(RuntimeError("Missing environment variable 'SECRET_URL'"))

    id = str(uuid.uuid4())
    ts = int(datetime.now().timestamp())  # In seconds

    try:
        app_client = create_app_client(user_pool_id, id)
    except Exception as e:
        return error(e)

    try:
        invite = persist(table_name, id, ts, app_client)
    except Exception as e:
        print(e)
        print("Something went wrong, initiating cleanup...")
        delete_app_client(app_client)
        return error(e)

    invite["timestamp"] = float(invite["timestamp"])
    invite["secretUrl"] = secret_url

    return json.dumps(invite)


def create_app_client(user_pool_id, client_name):
    print("Creating app client...")
    client = boto3.client('cognito-idp')
    response = client.create_user_pool_client(
        UserPoolId=user_pool_id,
        ClientName=client_name,
        GenerateSecret=True,
        ExplicitAuthFlows=[
            'ALLOW_REFRESH_TOKEN_AUTH',
            'ALLOW_USER_SRP_AUTH',
        ],
    )

    if "UserPoolClient" in response:
        return response["UserPoolClient"]
    else:
        raise RuntimeError("Invalid response from Cognito")


def delete_app_client(app_client):
    print("Deleting app client...")
    client = boto3.client('cognito-idp')
    client.delete_user_pool_client(
        UserPoolId=app_client["UserPoolId"],
        ClientId=app_client["ClientId"],
    )


def persist(table_name, id, timestamp, app_client):
    print("Persisting invite to DB...")
    client = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": id,
        "timestamp": timestamp,
        "clientId": app_client["ClientId"],
    }
    print("item:", item)
    client.put_item(Item=item)

    return item


def error(e):
    print(e)
    return {
        "error": {
            "message": e.__class__.__name__ + ": " + " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
