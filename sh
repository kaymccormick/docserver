echo 1
#./node_modules/.bin/browserify lib/publish.js --debug | ./node_modules/.bin/exorcist dist/pubbundle.js.map > dist/pubbundle.js
echo 2
./node_modules/.bin/browserify lib/editor.js --debug | ./node_modules/.bin/uglifyjs | ./node_modules/.bin/exorcist dist/editorbundle.js.map > dist/editorbundle.js 
