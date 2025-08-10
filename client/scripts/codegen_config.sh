#!/bin/bash
set -ef -o pipefail

while [ "$1" != "" ]; do
  case $1 in
    --api-id ) shift
      API_ID="$1"
    ;;
    --region ) shift
      REGION="$1"
    ;;
  esac

  shift
done

if [ -z "$API_ID" ] ||
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
