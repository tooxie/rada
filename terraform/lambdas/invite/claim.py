#!/usr/bin/env python3

# ###################################################################### #
# TODO: DELETE THIS LAMBDA WHEN WE HAVE THE INTERFACE IN PLACE TO CREATE #
# TODO: INVITATIONS THROUGH THE APP.                                     #
# ###################################################################### #

from datetime import datetime, timedelta
from botocore.config import Config
import random
import string
import boto3
import os
import hashlib

TPL_FILE_NAME="template.html"


def not_found():
    return {
        "statusCode": 301,
        "headers": {
            "Location": "https://www.google.com",
        },
    }


def ok(body):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "text/html",
        },
        "body": body,
    }


def handler(event, context):
    print("event:", event)

    table_name = os.environ["INVITATIONS_TABLE_NAME"]
    client = boto3.resource('dynamodb').Table(table_name)
    iid, ts = parse_url(event)
    invite = get_invite(client, iid, ts)
    if not invite:
        print(f"ERROR: Invite {iid} not found")
        return not_found()

    salt = get_salt(event)
    if not check_hash(invite, salt):
        print(f"ERROR: Hash check failed for invite {iid}")
        return not_found()

    if was_visited(invite):
        if was_installed(event):
            mark_installed(client, iid, ts)
            password = create_user(iid, is_admin=invite.get("isAdmin", False))
            return ok(password)
        elif was_unsolicited(event):
            mark_unsolicited(client, iid, ts)
            return not_found()
        print(f"ERROR: Invite {iid} already claimed")
        return not_found()

    if expired(invite):
        print(f"ERROR: Claiming expired invite {iid}")
        return not_found()

    mark_visited(client, iid, ts)

    tpl_path = os.path.join(os.environ['LAMBDA_TASK_ROOT'], TPL_FILE_NAME)
    print("Loading template at " + tpl_path)
    with open(tpl_path) as f:
        return ok(f.read())


def was_installed(event):
    qs = event.get("queryStringParameters")
    return 'installed' in qs


def was_unsolicited(event):
    qs = event.get("queryStringParameters")
    return 'unsolicited' in qs


def mark_visited(client, invite_id, timestamp):
    stamp(client, invite_id, timestamp, "visited")


def mark_installed(client, invite_id, timestamp):
    stamp(client, invite_id, timestamp, "installed")


def mark_unsolicited(client, invite_id, timestamp):
    stamp(client, invite_id, timestamp, "unsolicited")


def stamp(client, invite_id, timestamp, field):
    now = int(datetime.now().timestamp())
    client.update_item(
        Key={
            "id": invite_id,
            "timestamp": timestamp,
        },
        UpdateExpression=f"SET {field} = :now",
        ExpressionAttributeValues={
            ":now": now,
        },
    )


# def replace(html, **kwargs):
#     for key in kwargs.keys():
#         value = kwargs[key]
#         html = html.replace("{" + key + "}", str(value))
#     return html


def was_visited(invite):
    return bool(invite.get("visited"))


def expired(invite):
    timestamp = int(invite["timestamp"])
    creation = datetime.fromtimestamp(timestamp)
    validity = int(invite["validity"])
    expiry = creation + timedelta(hours=validity)

    return datetime.now() > expiry


PASSWORD_CHARS=string.ascii_letters + string.digits + string.punctuation
def generate_password(size=36, chars=PASSWORD_CHARS):
    invalid = ["'", '"', "\\"]
    for char in invalid:
        chars = chars.replace(char, "")

    return ''.join(random.choice(chars) for _ in range(size))


def parse_url(event):
    invite_id, timestamp = event["pathParameters"]["params"].split('/')
    return invite_id, int(timestamp)


def check_hash(invite, salt):
    id = invite["id"]
    ts = invite["timestamp"]
    seed = f"{id}${ts}${salt}".encode()
    hash = hashlib.sha256(seed).hexdigest()

    return hash == invite["hash"]


def get_salt(event):
    return event["queryStringParameters"]["s"]


def get_credentials(event):
    username = event["pathParameters"]["params"].split('/')[0]
    password = generate_password()

    return (username, password)


def get_invite(client, invite_id, timestamp):
    print("Key =", { "id": invite_id, "timestamp": timestamp })
    response = client.get_item(Key={
        "id": invite_id,
        "timestamp": timestamp,
    })

    if "Item" not in response:
        return None

    return response["Item"]


def create_user(username, *, is_admin):
    region = os.environ["AWS_REGION"]
    user_pool_id = os.environ["COGNITO_USER_POOL_ID"]
    client = boto3.client('cognito-idp', region_name=region)
    password = generate_password()
    response = client.admin_create_user(
        UserPoolId=user_pool_id,
        Username=username,
    )
    client.admin_set_user_password(
        UserPoolId=user_pool_id,
        Username=username,
        Password=password,
        Permanent=True,
    )

    if is_admin:
        admin_group_name = os.environ["COGNITO_ADMIN_GROUP_NAME"]
        client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=username,
            GroupName=admin_group_name,
        )

    return password
