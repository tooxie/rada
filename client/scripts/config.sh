#!/bin/bash
set -ef -o pipefail

cd "`dirname "${BASH_SOURCE[0]}"`/.."

while [ "$1" != "" ]; do
  case $1 in
    --api-id ) shift
      API_ID="$1"
    ;;
    --api-key ) shift
      API_KEY="$1"
    ;;
    --api-url ) shift
      API_URL="$1"
    ;;
    --auth-mode ) shift
      AUTH_MODE="$1"
    ;;
    --graphql-schema ) shift
      GRAPHQL_SCHEMA_SRC="$1"
    ;;
    --region ) shift
      REGION="$1"
    ;;
  esac

  shift
done

if [ -z "$API_ID" ] ||
   [ -z "$API_KEY" ] ||
   [ -z "$API_URL" ] ||
   [ -z "$AUTH_MODE" ] ||
   [ -z "$GRAPHQL_SCHEMA_SRC" ] ||
   [ -z "$REGION" ]
then
  echo "Parameter missing"
  exit 1
fi

GRAPHQL_SCHEMA_DEST="./schema.graphql"
cp "$GRAPHQL_SCHEMA_SRC" "$GRAPHQL_SCHEMA_DEST"

AMPLIFY_CONFIG_FILE="./.graphqlconfig.yml"
AMPLIFY_CONFIG="projects:
  Gawshi:
    schemaPath: src/graphql/schema.json
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
        framework: none
        maxDepth: 2
"
echo -en "$AMPLIFY_CONFIG" > "$AMPLIFY_CONFIG_FILE"

GRAPHQL_CONFIG_FILE="./src/graphql/config.ts"
GRAPHQL_CONFIG="export default {
  AuthMode: \"$AUTH_MODE\",
  ApiKey: \"$API_KEY\",
  ApiUrl: \"$API_URL\",
  Region: \"$REGION\",
}
"
echo -en "$GRAPHQL_CONFIG" > "$GRAPHQL_CONFIG_FILE"
