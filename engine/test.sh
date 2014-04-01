#!/bin/bash
S="abcdef"
if [[ "$S" == *def ]]
then
    echo true
else
    echo false
fi
