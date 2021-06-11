#!/bin/bash
set -euf -o pipefail

npx amplify codegen remove
rm -f ./.graphqlconfig.yml
rm -f ./src/graphql/config.ts
