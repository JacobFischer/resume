#!/bin/bash

# build scss -> css
./node_modules/.bin/node-sass ./scss/ -o ./assets/

# render page to pdf for handy downloads
cd ./to-pdf/wkhtmltox/
./bin/wkhtmltopdf --print-media-type --page-size Letter --no-outline --margin-top 0mm --margin-left 0mm --margin-right 0mm --margin-bottom 0mm --disable-smart-shrinking ../../index.html ../../resume-jacob-fischer.pdf



