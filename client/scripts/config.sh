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
   [ -z "$REGION" ]
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
echo -en "$AMPLIFY_CONFIG" > "$AMPLIFY_CONFIG_FILE"

GRAPHQL_CONFIG_FILE="./src/graphql/config.ts"
GRAPHQL_CONFIG="export default {
  AuthMode: \"`echo -n $AUTH_MODE | base64`\",
  ApiKey: \"`echo -n $API_KEY | base64`\",
  ApiUrl: \"`echo -n $API_URL | base64`\",
  Region: \"`echo -n $REGION | base64`\",
}
"
echo -en "$GRAPHQL_CONFIG" > "$GRAPHQL_CONFIG_FILE"
