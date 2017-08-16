#!/bin/bash

# remove the lines after this line to the gitignore so they are deployed by TravisCI
sed -n '/## REMOVE THESE TO DEPLOY/q;p' .gitignore > .gitignore
