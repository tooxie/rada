#!/usr/bin/env python3
from datetime import datetime
import boto3
import json
import os
import re
import urllib3


def handler(event, _):
    print("event:", event)
    print("input:", event.get("arguments", {}).get("input", {}))

    region = os.getenv("AWS_REGION")
    if not region:
        return error(RuntimeError("Missing environment variable 'AWS_REGION'"))

    servers_table = os.getenv("SERVERS_TABLE_NAME")
    if not servers_table:
        return error(RuntimeError("Missing environment variable 'SERVERS_TABLE_NAME'"))

    invites_table = os.getenv("SERVER_INVITATIONS_TABLE_NAME")
    if not invites_table:
        return error(RuntimeError("Missing environment variable 'SERVER_INVITATIONS_TABLE_NAME'"))

    user_pool_id = os.getenv("COGNITO_USER_POOL_ID")
    if not user_pool_id:
        return error(RuntimeError("Missing environment variable 'COGNITO_USER_POOL_ID'"))

    identity_pool_id = os.getenv("COGNITO_IDENTITY_POOL_ID")
    if not identity_pool_id:
        return error(RuntimeError("Missing environment variable 'COGNITO_IDENTITY_POOL_ID'"))

    server_name = os.getenv("SERVER_NAME")
    if not server_name:
        return error(RuntimeError("Missing environment variable 'SERVER_NAME'"))

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

    client_id_url = get_client_id_url(event)
    if not client_id_url:
        return error(RuntimeError("No client ID URL provided"))

    name = get_name(event)
    header_url = get_header_url(event)
    secret = get_secret(event)

    try:
        client_id = get_client_id(
            url=client_id_url,
            invite_id=invite_id,
            ts=timestamp,
            server_name=server_name,
            secret=secret,
        )
    except Exception as e:
        return error(e)

    if not client_id:
        return error(RuntimeError("Client ID not found"))

    server = persist(servers_table, {
        "id": server_id,
        "name": name,
        "region": region,
        "api_url": api_url,
        "idp_url": idp_url,
        "header_url": header_url,
        "user_pool_id": user_pool_id,
        "identity_pool_id": identity_pool_id,
        "client_id": client_id,
    })

    create_identity_provider(
        client_id=client_id,
        idp_url=idp_url,
        idp_name=server_id,
        user_pool_id=user_pool_id,
    )

    try:
        delete_invite(invites_table, invite_id)
    except Exception as e:
        print(e)

    print("OK")
    return json.dumps(server)


def create_identity_provider(*,
    user_pool_id,
    idp_name,
    idp_url,
    client_id
):
    cognito = boto3.client('cognito-idp')
    args = {
        "UserPoolId": user_pool_id,
        "ProviderName": idp_name,
        "ProviderType": "OIDC",
        "ProviderDetails": {
            "client_id": client_id,
            "oidc_issuer": idp_url,
            "authorize_scopes": "openid",
            "attributes_request_method": "GET",
        },
    }
    print("Creating IDP:", args)
    idp = cognito.create_identity_provider(**args)
    print(idp)


def persist(table_name, data):
    print(f"Writing to table '{table_name}'...")
    dynamodb = boto3.resource('dynamodb').Table(table_name)
    item = {
        "id": data["id"],
        "name": data["name"],
        "region": data["region"],
        "apiUrl": data["api_url"],
        "idpUrl": data["idp_url"],
        "headerUrl": data["header_url"],
        "userPoolId": data["user_pool_id"],
        "identityPoolId": data["identity_pool_id"],
        "clientId": data["client_id"],
        "timestamp": int(datetime.now().timestamp()),
        "banned": False,
    }
    print("Putting item:", item)
    dynamodb.put_item(
        Item=item,
        ConditionExpression="attribute_not_exists(id)"
    )

    return item


def delete_invite(table_name, id):
    print(f"Deleting invite '{id}' from table '{table_name}'")
    dynamodb = boto3.resource('dynamodb').Table(table_name)
    item = dynamodb.delete_item(Key={"id": id}, ReturnValues="ALL_OLD")

    print("Deleted item:", item)
    if "Attributes" not in item:
        return None

    return item["Attributes"]


def get_input(event, input_name, default_value=None):
    inputs = event.get("arguments", {}).get("input", {})
    return inputs.get(input_name, default_value)


def get_server_id(event):
    return get_input(event, "server").get("id")


def get_name(event):
    return get_input(event, "server").get( "name")


def get_header_url(event):
    return get_input(event, "server").get("headerUrl")


def get_api_url(event):
    return get_input(event, "server").get("apiUrl")


def get_idp_url(event):
    return get_input(event, "server").get("idpUrl")


def get_secret(event):
    return get_input(event, "invite").get("secret")


def get_invite_id(event):
    return get_input(event, "invite").get("id")


def get_client_id_url(event):
    return get_input(event, "invite").get("clientIdUrl")


def get_timestamp(event):
    return get_input(event, "invite").get("timestamp")


SLUGIFY_RE = re.compile(r"[\W]+")
def slugify(s):
    return SLUGIFY_RE.sub('', s)


def get_client_id(*, url, invite_id, ts, server_name, secret):
    print("Getting client ID...")
    params = {
        "name": slugify(server_name),
        "secret": secret,
    }
    query_string = "&".join([f"{p}={params[p]}" for p in params])
    client_id_url = f"{url}/{invite_id}/{str(ts)}?{query_string}"
    print("GET", client_id_url)
    http = urllib3.PoolManager()
    resp = http.request('GET', client_id_url)

    print(f"Got {resp.status} from {client_id_url}")

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
