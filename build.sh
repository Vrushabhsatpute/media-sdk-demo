#!/bin/bash
set -e

echo "Building media-core..."
cd packages/media-core
npm install
node node_modules/typescript/bin/tsc

echo "Building media-react..."
cd ../media-react
npm install
node node_modules/typescript/bin/tsc

echo "Building media-ui-react..."
cd ../media-ui-react
npm install
node node_modules/typescript/bin/tsc

echo "Building web-app..."
cd ../../apps/web-app
npm install
npm run build

echo "Build complete."
