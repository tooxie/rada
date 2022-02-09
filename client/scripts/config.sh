#!/bin/bash
set -ef -o pipefail

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
echo "$AMPLIFY_CONFIG" > "$AMPLIFY_CONFIG_FILE"

tobase64 () {
  if [ "`uname`" = "Darwin" ]; then
    echo "$1" | tr -d '\n' | base64 | tr -d '\n'
  else
    echo -n "$1" | base64 | tr -d '\n'
  fi
}

GRAPHQL_CONFIG_FILE="./src/graphql/config.ts"
GRAPHQL_CONFIG="export default {
  AuthMode: \"`tobase64 $AUTH_MODE`\",
  ApiKey: \"`tobase64 $API_KEY`\",
  ApiUrl: \"`tobase64 $API_URL`\",
  Region: \"`tobase64 $REGION`\",
}
"
if [ "`uname`" = "Darwin" ]; then
  echo "$GRAPHQL_CONFIG" > "$GRAPHQL_CONFIG_FILE"
else
  echo -e "$GRAPHQL_CONFIG" > "$GRAPHQL_CONFIG_FILE"
fi


# TODO: Load fixtures here
