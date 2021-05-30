#!/bin/bash
set -euf -o pipefail

transform () {
  FILE="$1"
  HEADER="import gql from 'graphql-tag';\n"
  CONTENT=`sed 's/\/\* GraphQL \*\/ /gql/g' "$FILE"`
  echo -en "$HEADER" > "$FILE"
  echo -en "$CONTENT\n" >> "$FILE"
}

cd "`dirname "${BASH_SOURCE[0]}"`/.."
npx amplify codegen

MUTATIONS_FILE="src/graphql/mutations.ts"
transform $MUTATIONS_FILE

QUERIES_FILE="src/graphql/queries.ts"
transform $QUERIES_FILE
