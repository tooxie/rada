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
        print("Error: Invitation ID and/or timestamp not found in URL")
        return not_found()

    app_name = get_name(event)
    if not app_name:
        print("Error: App name not found in request")
        return not_found()

    secret = get_secret(event)
    if not secret:
        print("Error: Secret not found in request")
        return not_found()

    invite = get_invite(table_name, invite_id)
    if not invite:
        print(f"Error: Invitation '{invite_id}' does not exist")
        return not_found()

    if not invite_is_valid(invite, timestamp):
        print("Error: Invitation is not valid")
        return not_found()

    client_id = get_client_id(
        user_pool_id=user_pool_id,
        invite_id=invite_id,
        app_name=app_name,
    )
    delete_invite(table_name, invite_id)

    if not client_id:
        print("Error getting client ID")
        return not_found()


    return ok(client_id)


def get_invite(table_name, invite_id):
    print(f"Getting invite '{invite_id}' from table '{table_name}'...")
    dynamodb = boto3.resource('dynamodb').Table(table_name)
    response = dynamodb.get_item(Key={"id": invite_id})
    print(response)

    if "Item" not in response:
        return None

    return response["Item"]


def delete_invite(table_name, invite_id):
    print(f"Deleting invite '{invite_id}'...")
    dynamodb = boto3.resource('dynamodb').Table(table_name)
    dynamodb.delete_item(Key={"id": invite_id})


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


def get_client_id(*, user_pool_id, invite_id, app_name):
    print("Creating app client...")
    cognito = boto3.client('cognito-idp')
    suffix = invite_id.split("-")[0]
    client_name = f"{app_name[:16]}-{suffix}"
    args = {
        "UserPoolId": user_pool_id,
        "ClientName": client_name,
        "GenerateSecret": False,
        "ExplicitAuthFlows": [
            'ALLOW_REFRESH_TOKEN_AUTH',
            'ALLOW_USER_SRP_AUTH',
        ],
    }
    response = cognito.create_user_pool_client(**args)

    print(response)
    try:
        return response["UserPoolClient"]["ClientId"]
    except Exception as e:
        print(e)
        raise RuntimeError(f"Invalid response from Cognito (args: {args})")


def parse_url(event):
    invite_id, timestamp = event["pathParameters"]["params"].split('/')
    try:
        return (invite_id, int(timestamp))
    except:
        return (None, None)


def get_name(event):
    try:
        return event["queryStringParameters"]["name"]
    except:
        return None


def get_secret(event):
    try:
        return event["queryStringParameters"]["secret"]
    except:
        return None


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
