#!/bin/bash
MY_PATH=${PWD}
TIME=$(date +%s)
WD=/tmp/testModule-${TIME}
echo "Test path: ${WD}"
mkdir -p $WD
cd $WD
npm init --force
npm install $MY_PATH
cp $MY_PATH/releaseTest/index.js $WD
node index.js