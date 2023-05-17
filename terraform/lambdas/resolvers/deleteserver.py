#!/usr/bin/env python3
from datetime import datetime
import boto3
import json
import os


def handler(event, context):
    print("event:", event)

    table_name = os.getenv("TABLE_NAME")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'TABLE_NAME'"))

    user_pool_id = os.getenv("USER_POOL_ID")
    if not table_name:
        return error(RuntimeError("Missing environment variable 'USER_POOL_ID'"))

    server_id = get_id(event)
    if not server_id:
        return error(RuntimeError("No ID provided"))

    try:
        server = delete_server(table_name, server_id)
    except Exception as e:
        return error(e)

    if not server:
        return error(RuntimeError(f"No '{server_id}' found in table '{table_name}'"))

    # [ERROR] TypeError: Object of type Decimal is not JSON serializable
    server["timestamp"] = float(server["timestamp"])

    try:
        delete_app_client(user_pool_id, server["clientId"])
    except Exception as e:
        print(e)

    try:
        delete_identity_provider(user_pool_id, server["name"])
    except Exception as e:
        print(e)

    return json.dumps(server)


def delete_app_client(user_pool_id, client_id):
    print("Deleting app client...")
    cognito = boto3.client('cognito-idp')
    cognito.delete_user_pool_client(
        UserPoolId=user_pool_id,
        ClientId=client_id,
    )


def delete_identity_provider(user_pool_id, idp_name):
    print(f"Deleting idp '{idp_name}' from pool '{user_pool_id}'...")
    cognito = boto3.client('cognito-idp')
    cognito.delete_identity_provider(
        UserPoolId=user_pool_id,
        ProviderName=idp_name,
    )


def delete_server(table_name, id):
    print(f"Deleting key '{id}' from table '{table_name}'")
    dynamodb = boto3.resource('dynamodb').Table(table_name)
    item = dynamodb.delete_item(Key={"id": id}, ReturnValues="ALL_OLD")

    print(item)
    if "Attributes" not in item:
        return None

    return item["Attributes"]


def get_id(event):
    return event.get("arguments", {}).get("id")


def error(e):
    print(e)
    return {
        "error": {
            "message": e.__class__.__name__ + ": " + " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
