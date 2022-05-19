#!/usr/bin/env bash

set -e

echo "building ..."

cd packages/progress && yarn build
cd ../contract-function && yarn build

cd ../..

echo "preparing release ..."

lerna version --conventional-commits $1
