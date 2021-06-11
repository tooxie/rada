#!/bin/bash
set -euf -o pipefail

transform () {
  FILE="$1"
  HEADER='import gql from "graphql-tag";'
  CONTENT=`sed 's/\/\* GraphQL \*\/ /gql/g' "$FILE"`
  echo -e "$HEADER" > "$FILE"
  echo -e "$CONTENT" >> "$FILE"
}

GRAPHQL_SCHEMA_SRC="../terraform/schema.graphql"
GRAPHQL_SCHEMA_DEST="./schema.graphql"
cp "$GRAPHQL_SCHEMA_SRC" "$GRAPHQL_SCHEMA_DEST"

npx amplify codegen
rm -f "$GRAPHQL_SCHEMA_DEST"

MUTATIONS_FILE="src/graphql/mutations.ts"
transform $MUTATIONS_FILE

QUERIES_FILE="src/graphql/queries.ts"
transform $QUERIES_FILE

npm run format > /dev/null
