#!/bin/bash
set -f -o pipefail

while [ "$1" != "" ]; do
  case $1 in
    --region ) shift
      REGION="$1"
    ;;
    --client-id ) shift
      CLIENT_ID="$1"
    ;;
    --user-pool-id ) shift
      USER_POOL_ID="$1"
    ;;
    --identity-pool-id ) shift
      IDENTITY_POOL_ID="$1"
    ;;
  esac

  shift
done

if [ -z "$REGION" ] ||
   [ -z "$CLIENT_ID" ] ||
   [ -z "$USER_POOL_ID" ] ||
   [ -z "$IDENTITY_POOL_ID" ]
then
  echo "Missing parameter"
  exit 1
fi

USER_POOL_CONFIG_FILE="./src/userpool.json"
USER_POOL_CONFIG="{
  \"region\": \"$REGION\",
  \"clientId\": \"$CLIENT_ID\",
  \"userPoolId\": \"$USER_POOL_ID\",
  \"identityPoolId\": \"$IDENTITY_POOL_ID\"
}
"
if [ "$(uname)" = "Darwin" ]; then
  echo "$USER_POOL_CONFIG" > "$USER_POOL_CONFIG_FILE"
else
  echo -e "$USER_POOL_CONFIG" > "$USER_POOL_CONFIG_FILE"
fi
