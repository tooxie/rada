#!/bin/bash
set -ef -o pipefail

while [ "$1" != "" ]; do
  case $1 in
    --api-id ) shift
      API_ID="$1"
    ;;
    --api-url ) shift
      API_URL="$1"
    ;;
    --region ) shift
      REGION="$1"
    ;;
    --server-id ) shift
      SERVER_ID="$1"
    ;;
  esac

  shift
done

if [ -z "$API_ID" ] ||
   [ -z "$API_URL" ] ||
   [ -z "$REGION" ] ||
   [ -z "$SERVER_ID" ]
then
  echo "Parameter missing"
  exit 1
fi

AMPLIFY_CONFIG_FILE="./.graphqlconfig.yml"
AMPLIFY_CONFIG="projects:
  Gawshi:
    schemaPath: ./schema.graphql
    includes:
      - src/graphql/**/*.ts
    excludes:
      - ./amplify/**
    extensions:
      amplify:
        codeGenTarget: typescript
        generatedFileName: src/graphql/api.ts
        docsFilePath: src/graphql
        region: $REGION
        apiId: $API_ID
        frontend: javascript
        framework: react
        maxDepth: 2
"
echo "$AMPLIFY_CONFIG" > "$AMPLIFY_CONFIG_FILE"

tobase64 () {
  if [ "`uname`" = "Darwin" ]; then
    echo "$1" | tr -d '\n' | base64 | tr -d '\n'
  else
    echo -n "$1" | base64 | tr -d '\n'
  fi
}

CONFIG_FILE="./src/config.json"
CONFIG="{
  \"graphql\": {
    \"url\": \"$API_URL\"
  },
  \"region\": \"$REGION\",
  \"serverId\": \"$SERVER_ID\"
}
"
if [ "`uname`" = "Darwin" ]; then
  echo "$CONFIG" > "$CONFIG_FILE"
else
  echo -e "$CONFIG" > "$CONFIG_FILE"
fi
