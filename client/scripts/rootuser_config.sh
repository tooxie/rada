#!/bin/bash
set -ef -o pipefail

while [ "$1" != "" ]; do
  case $1 in
    --username ) shift
      USERNAME="$1"
    ;;
    --password ) shift
      PASSWORD="$1"
    ;;
  esac

  shift
done

if [ -z "$USERNAME" ] ||
   [ -z "$PASSWORD" ]
then
  echo "Parameter missing"
  exit 1
fi

ROOT_USER_CONFIG_FILE="./src/rootuser.json"
ROOT_USER_CONFIG="{
  \"username\": \"$USERNAME\",
  \"password\": \"$PASSWORD\"
}
"
if [ "$(uname)" = "Darwin" ]; then
  echo "$ROOT_USER_CONFIG" > "$ROOT_USER_CONFIG_FILE"
else
  echo -e "$ROOT_USER_CONFIG" > "$ROOT_USER_CONFIG_FILE"
fi
