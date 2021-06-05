#!/bin/bash
set -euf -o pipefail

cd "`dirname "${BASH_SOURCE[0]}"`/.."

npx amplify codegen remove
rm -f ./.graphqlconfig.yml
rm -f ./src/graphql/config.ts
