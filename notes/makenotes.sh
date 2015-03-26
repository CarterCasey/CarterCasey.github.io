#!/bin/bash

for class in IDS compilers web networks; do
	cp /Users/Carter/Desktop/Spring-2015/$class/notes/*.md $class/
	for md_file in $class/*.md; do
		python topage.py $md_file
	done
done

