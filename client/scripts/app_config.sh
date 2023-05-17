#!/bin/bash
set -ef -o pipefail

# Reads the given arguments and returns "" if it begins with a "--". This is
# useful when an argument is missing, for example:
#  ./script.sh --arg-1 --arg-2 some_value
# Without this check the script would think that the value for --arg-1 is
# "--arg-2", when in reality the parameter --arg-1 has no value.
read_arg() {
  if [[ "$1" == --* ]]; then
    echo ""
  else
    echo "$1"
  fi
}

while [ "$1" != "" ]; do
  case $1 in
    --api-url ) shift
      API_URL=`read_arg $1`
    ;;
    --client-id ) shift
      CLIENT_ID=`read_arg $1`
    ;;
    --cognito-admin-group-name ) shift
      COGNITO_ADMIN_GROUP_NAME=`read_arg $1`
    ;;
    --id-pool-id ) shift
      ID_POOL_ID=`read_arg $1`
    ;;
    --idp-url ) shift
      IDP_URL=`read_arg $1`
    ;;
    --region ) shift
      REGION=`read_arg $1`
    ;;
    --server-id ) shift
      SERVER_ID=`read_arg $1`
    ;;
    --server-name ) shift
      SERVER_NAME=`read_arg $1`
    ;;
    --user-pool-id ) shift
      USER_POOL_ID=`read_arg $1`
    ;;
  esac

  shift
done

if [ -z "$API_URL" ] ||
   [ -z "$CLIENT_ID" ] ||
   [ -z "$ID_POOL_ID" ] ||
   [ -z "$COGNITO_ADMIN_GROUP_NAME" ] ||
   [ -z "$IDP_URL" ] ||
   [ -z "$REGION" ] ||
   [ -z "$SERVER_ID" ] ||
   [ -z "$SERVER_NAME" ] ||
   [ -z "$USER_POOL_ID" ]
then
  echo "Parameter missing"
  exit 1
fi

prefix_url_with_https() {
  URL=$1
  [[ $URL = https://* ]] && echo $URL || echo "https://$URL"
}

CONFIG_FILE="./src/config.json"
CONFIG="{
  \"region\": \"$REGION\",
  \"server\": {
    \"id\": \"$SERVER_ID\",
    \"name\": \"$SERVER_NAME\",
    \"api\": \"` prefix_url_with_https $API_URL`\"
  },
  \"idp\": {
    \"url\": \"`prefix_url_with_https $IDP_URL`\",
    \"clientId\": \"$CLIENT_ID\",
    \"identityPoolId\": \"$ID_POOL_ID\",
    \"userPoolId\": \"$USER_POOL_ID\",
    \"adminGroupName\": \"$COGNITO_ADMIN_GROUP_NAME\"
  }
}
"
echo $CONFIG
if [ "`uname`" = "Darwin" ]; then
  echo "$CONFIG" > "$CONFIG_FILE"
else
  echo -e "$CONFIG" > "$CONFIG_FILE"
fi
