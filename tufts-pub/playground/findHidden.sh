#!/bin/bash

for p in `find ~ -name "*.jpg" 2> /dev/null`; do
	if [ -z `file "$p" | sed -e 's/.*jpg://' | grep -e JPEG` ]; then
		file "$p"
	fi
done | grep -vi "No such file" 2> /dev/null > .non-jpgs
