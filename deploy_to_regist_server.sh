#!/bin/sh

ORIGINAL=$(pwd)
CURRENT=$(cd $(dirname $0) && pwd)

cd $CURRENT

npm install update
sudo npm install -g bower grunt-cli
yes Y | bower install
grunt setup

rm -Rf ../../public/contests/1
cp -R client ../../public/contests/1
mv ../../public/contests/1/replayer ../../public/contests/1/results

cd $ORIGINAL
