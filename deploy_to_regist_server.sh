#!/bin/sh

ORIGINAL=$(pwd)
CURRENT=$(cd $(dirname $0) && pwd)

cd $CURRENT

npm install
bower install
grunt setup

cp -R client ../../public/contests/1
mv ../../public/contests/1/replayer ../../public/contests/1/results

cd $ORIGINAL
