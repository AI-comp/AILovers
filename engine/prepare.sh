#!/bin/bash
S=$1
if [[ "$S" == *.cpp ]]
then
	gcc $1 -o out
	echo "./out" > run.sh
elif [[ "$S" == *.c ]]
then
	gcc -std=c99 $1 -o out
	echo "./out" > run.sh
elif [[ "$S" == *.java ]]
then
	javac $1
	echo "java " ${S:0:${#S}-5} > run.sh
elif [[ "$S" == *.ruby ]]
then
	echo "ruby " $1 > run.sh
elif [[ "$S" == *.scala ]]
then
	scalac $1
	echo "scala " ${S:0:${#S}-6} > run.sh
elif [[ "$S" == *.python ]]
then
	echo "python " $1 > run.sh
fi
