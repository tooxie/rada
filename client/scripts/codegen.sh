#!/bin/bash
set -euf -o pipefail

transform () {
  FILE="$1"
  HEADER='import gql from "graphql-tag";'
  CONTENT=$(sed 's/\/\* GraphQL \*\/ /gql/g' "$FILE")

  if [ "$(uname)" = "Darwin" ]; then
    echo "$HEADER" > "$FILE"
    echo "$CONTENT" >> "$FILE"
  else
    echo -e "$HEADER" > "$FILE"
    echo -e "$CONTENT" >> "$FILE"
  fi
}

[ ! -f "schema.graphql" ] && ln -s "../terraform/schema.graphql" .
npx amplify codegen

MUTATIONS_FILE="src/graphql/mutations.ts"
transform $MUTATIONS_FILE

QUERIES_FILE="src/graphql/queries.ts"
transform $QUERIES_FILE

npm run format > /dev/null
