#!/bin/sh
python convert.py || { echo "conversion failed"; exit 1; } 
git apply changes.patch || { echo "patching failed"; exit 1; } 
./build.sh
