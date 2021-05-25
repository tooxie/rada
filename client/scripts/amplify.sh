#!/bin/bash
# TODO: set up amplify for the new api:
# 1. Delete previous config
# 2. Set up a new config with reasonable defaults
# https://docs.amplify.aws/cli/usage/headless
echo "npx amplify add codegen --apiId $1"
