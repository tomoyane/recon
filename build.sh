#!/bin/bash

set -e

INSTALL=0
BUILD=0
ENV=0

if [ "$1" = "-i" -o "$1" = "--install" ]; then
  INSTALL=1
fi

if [ "$1" = "-b" -o "$1" = "--build" ]; then
  BUILD=1
fi

if [ -n "$2" ]; then
  if [ "$2" = "-p" -o "$2" = "--prod" ]; then
    ENV=1
  fi
fi

# Install package
if [ "$INSTALL" -eq 1 ]; then
  cd extension
  npm ci
  cd ..
  cd ui-frame
  npm ci
  cd ..
  exit 0
fi

if [ "$BUILD" -eq 0 ]; then
  echo "Command line arg is only --build at first" 1>&2
  exit 1
fi

# Mkdir dist 
dir_name=""
if [ "$ENV" -eq 0 ]; then
  rm -rf dist-dev > /dev/null
  dir_name="dist-dev"
else
  rm -rf dist > /dev/null
  dir_name="dist"
fi
mkdir ${dir_name}

# Build ui-frame
cd ./ui-frame

if [ "$ENV" -eq 0 ]; then
  echo "Build ui-frame development mode"
  ng build --aot
else
  echo "Build ui-frame production mode"
  ng build --prod
fi

cp -r dist/ui-frame ../${dir_name}/ui-frame
cd ../
echo "Completed ui-frame build!"

# Build extension
cd extension

if [ "$ENV" -eq 0 ]; then
  echo "Build extension development mode"
  npm run clean build; npm run build-dev;
else
  echo "Build extension production mode"
  npm run clean build; npm run build-prod;
fi

cp -r dist ../${dir_name}/extension
cd ..
cp manifest.json ${dir_name}/

# Compression dist
zip -r ${dir_name}.zip ${dir_name}

echo "Completed recon build!"
exit 0
