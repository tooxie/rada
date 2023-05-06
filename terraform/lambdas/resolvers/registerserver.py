#!/usr/bin/env python3
from datetime import datetime, timedelta
import boto3
import json
import os
import urllib3


def handler(event, _):
    print("event:", event)
    print("input:", event.get("arguments", {}).get("input", {}))

    servers_table = os.getenv("SERVERS_TABLE_NAME")
    if not servers_table:
        return error(RuntimeError("Missing environment variable 'SERVERS_TABLE_NAME'"))

    invites_table = os.getenv("SERVER_INVITATIONS_TABLE_NAME")
    if not invites_table:
        return error(RuntimeError("Missing environment variable 'SERVER_INVITATIONS_TABLE_NAME'"))

    user_pool_id = os.getenv("COGNITO_USER_POOL_ID")
    if not user_pool_id:
        return error(RuntimeError("Missing environment variable 'COGNITO_USER_POOL_ID'"))

    server_id = get_server_id(event)
    if not server_id:
        return error(RuntimeError("No server ID provided"))

    api_url = get_api_url(event)
    if not api_url:
        return error(RuntimeError("No API URL provided"))

    idp_url = get_idp_url(event)
    if not idp_url:
        return error(RuntimeError("No IDP URL provided"))

    invite_id = get_invite_id(event)
    if not invite_id:
        return error(RuntimeError("No invite ID provided"))

    timestamp = get_timestamp(event)
    if not timestamp:
        return error(RuntimeError("No timestamp provided"))

    secret_url = get_secret_url(event)
    if not secret_url:
        return error(RuntimeError("No secret URL provided"))

    name = get_name(event)
    note = get_note(event)
    header_url = get_header_url(event)
    client_id = get_client_id(event)

    try:
        secret = get_secret(secret_url, invite_id, timestamp)
    except Exception as e:
        return error(e)

    if not secret:
        return error(RuntimeError("Secret not found"))

    try:
        server = persist(servers_table, {
            "id": server_id,
            "name": name,
            "note": note,
            "api_url": api_url,
            "idp_url": idp_url,
            "header_url": header_url,
            "client": {
                "id": client_id,
                "secret": secret,
            }
        })
    except Exception as e:
        print(e)
        return error(RuntimeError("Server exists"))

    create_identity_provider(user_pool_id, name, idp_url, client_id, secret)

    try:
        delete_invite(invites_table, invite_id)
    except Exception as e:
        print(e)

    print("OK")
    return json.dumps(server)


def create_identity_provider(user_pool_id, name, idp_url, client_id, client_secret):
    client = boto3.client('cognito-idp')
    args = {
        "UserPoolId": user_pool_id,
        "ProviderName": name,
        "ProviderType": "OIDC",
        "ProviderDetails": {
            "client_id": client_id,
            "client_secret": client_secret,
            "oidc_issuer": idp_url,
            "authorize_scopes": "openid",
            "attributes_request_method": "GET",
        },
    }
    print("Creating IDP:", args)
    idp = client.create_identity_provider(**args)
    print(idp)


def persist(table_name, data):
    print(f"Writing to table '{table_name}'...")
    client = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": data["id"],
        "name": data["name"],
        "note": data["note"],
        "apiUrl": data["api_url"],
        "idpUrl": data["idp_url"],
        "headerUrl": data["header_url"],
        "clientId": data["client"]["id"],
        "clientSecret": data["client"]["secret"],
        "timestamp": int(datetime.now().timestamp()),
        "banned": False,
        "handshakeCompleted": False,
    }
    print("Putting item:", item)
    client.put_item(
        Item=item,
        ConditionExpression="attribute_not_exists(id)"
    )

    return item


def delete_invite(table_name, id):
    print(f"Deleting invite '{id}' from table '{table_name}'")
    client = boto3.resource('dynamodb').Table(table_name)
    item = client.delete_item(Key={"id": id}, ReturnValues="ALL_OLD")

    print("Deleted item:", item)
    if "Attributes" not in item:
        return None

    return item["Attributes"]


# def invite_is_valid(table_name, id):
#     print(f"Checking validity of invite '{id}'")
#     client = boto3.resource('dynamodb').Table(table_name)
#     resp = client.get_item(Key={"id": id})
#
#     print("Response:", resp)
#     try:
#         item = resp["Item"]
#         timestamp = datetime.fromtimestamp(item["timestamp"])
#     except Exception as e:
#         print(e)
#         return False
#     one_hour = timedelta(hours=1)
#
#     return timestamp + one_hour > datetime.now()


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


def get_invite_id(event):
    return get_input(event, "inviteId")


def get_client_id(event):
    return get_input(event, "clientId")


def get_secret_url(event):
    return get_input(event, "secretUrl")


def get_timestamp(event):
    return get_input(event, "timestamp")


def get_secret(url, invite_id, timestamp):
    print("Getting secret...")
    secret_url = f"{url}/{invite_id}/{str(timestamp)}"
    print("GET", secret_url)
    http = urllib3.PoolManager()
    resp = http.request('GET', secret_url)

    print(f"Got {resp.status} from {secret_url}")

    if resp.status != 200:
        raise RuntimeError(f"Server replied with {resp.status}")

    return resp.data.decode("utf-8")


def error(e):
    print(e)
    return {
        "error": {
            "message": e.__class__.__name__ + ": " + " ".join(e.args),
            "type": e.__class__.__name__,
        }
    }
