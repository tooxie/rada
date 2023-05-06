#!/usr/bin/env python3
from datetime import datetime, timedelta
import os

import boto3


def handler(event, _):
    print("event:", event)

    table_name = os.getenv("SERVER_INVITATIONS_TABLE_NAME")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'SERVER_INVITATIONS_TABLE_NAME'"))

    user_pool_id = os.getenv("COGNITO_USER_POOL_ID")
    if not user_pool_id:
        return error(RuntimeError("Missing environment variable 'COGNITO_USER_POOL_ID'"))

    invite_id, timestamp = parse_url(event)
    if not invite_id or not timestamp:
        print("Invitation ID and/or timestamp not found in URL")
        return not_found()

    invite = get_invite(table_name, invite_id)
    if not invite:
        print("Invitation not found")
        return not_found()

    if not invite_is_valid(invite, timestamp):
        print("Invitation is not valid")
        return not_found()

    secret = get_secret(user_pool_id, invite["clientId"])
    if not secret:
        print("Secret not found")
        return not_found()

    delete_invite(table_name, invite_id)

    return ok(secret)


def get_invite(table_name, invite_id):
    print(f"Getting invite '{invite_id}' from table '{table_name}'...")
    client = boto3.resource('dynamodb').Table(table_name)
    response = client.get_item(Key={"id": invite_id})
    print(response)

    if "Item" not in response:
        return None

    return response["Item"]


def delete_invite(table_name, invite_id):
    print(f"Deleting invite '{invite_id}'...")
    client = boto3.resource('dynamodb').Table(table_name)
    client.delete_item(Key={"id": invite_id})


def invite_is_valid(invite, timestamp):
    print(f"Checking validity of invite...")
    if invite["timestamp"] != timestamp:
        t1 = str(invite["timestamp"])
        t1_type = type(invite["timestamp"])
        t2 = str(timestamp)
        t2_type = type(timestamp)
        print(f"{t1} ({t1_type}) != {t2} ({t2_type})")
        return False

    try:
        timestamp = datetime.fromtimestamp(timestamp)
    except Exception as e:
        print(e)
        return False
    one_hour = timedelta(hours=1)

    is_valid = timestamp + one_hour > datetime.now()
    if is_valid:
        print("Invitation OK")

    return is_valid


def get_secret(user_pool_id, client_id):
    client = boto3.client('cognito-idp')
    app_client = client.describe_user_pool_client(
        UserPoolId=user_pool_id,
        ClientId=client_id,
    )

    return app_client["UserPoolClient"]["ClientSecret"]


def parse_url(event):
    invite_id, timestamp = event["pathParameters"]["params"].split('/')
    return invite_id, int(timestamp)


def error(e):
    print(e)
    return ok(f"{e.__class__.__name__}: {' '.join(e.args)}", 500)


def not_found():
    return {
        "statusCode": 404,
    }


def ok(body, code=200):
    return {
        "statusCode": code,
        "headers": {
            "Content-Type": "text/plain",
            "Cache-Control": "no-store",
            "Pragma": "no-cache",
        },
        "body": body,
    }
