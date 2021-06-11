#!/usr/bin/env python3
import argparse
import configparser
import os

CONFIG_PATH = "./gawshi.conf"


def main(args):
    config = get_config()
    config["gawshi"]["aws_region"] = args.region
    config["gawshi"]["bucket_name"] = args.bucket_name
    config["gawshi"]["bucket_url"] = args.bucket_url
    config["gawshi"]["graphql_api_url"] = args.api_url
    config["gawshi"]["ssm_username"] = args.ssm_parameter_username
    config["gawshi"]["ssm_password"] = args.ssm_parameter_password
    config["gawshi"]["cognito_client_id"] = args.cognito_client_id

    with open(CONFIG_PATH, "w") as f:
        config.write(f)


def get_config():
    config = configparser.ConfigParser()

    if os.path.exists(CONFIG_PATH):
        config.read(CONFIG_PATH)
    else:
        populate(config)

    return config


def populate(config):
    config.add_section("gawshi")
    config.set("gawshi", "db_url", "sqlite:///shiva/gawshi.db")
    config.set("gawshi", "discogs_token", "")
    config.set("gawshi", "music_dir", "~/Music/gawshi")
    config.set("gawshi", "sqlalchemy_echo", "false")


parser = argparse.ArgumentParser()
parser.add_argument("--api-url", help="Graphql's endpoint")
parser.add_argument("--bucket-name",
    help="The name of the S3 bucket that will host the music")
parser.add_argument("--bucket-url", help="The bucket's domain name")
parser.add_argument("--ssm-parameter-username",
    help="SSM parameter name where the username is stored")
parser.add_argument("--ssm-parameter-password",
    help="SSM parameter name where the password is stored")
parser.add_argument("--cognito-client-id", help="Cognito's client id")
parser.add_argument("--region", help="The region where Gawshi was deployed")
parser.set_defaults(func=main)

if __name__ == "__main__":
    args = parser.parse_args()
    args.func(args)
