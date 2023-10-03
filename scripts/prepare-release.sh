#!/usr/bin/env bash

set -e

echo "building ..."

cd packages/progress && pnpm build
cd ../contract-function && pnpm build
cd ../async-task && pnpm build
cd ../async-value && pnpm build

cd ../..

echo "preparing release ..."

lerna version --conventional-commits $1
