const fs = require('fs');
const express = require('express');
const router = express.Router();

const React = require('react')

const docutilsServe = require('../middleware/docutilsServe');

const path = require('path');
const App = require('../lib/App').default;
const docPath = path.join(__dirname, '../doc-xml')

const parse = require('docutils-js').parse;
const baseSettings = require('docutils-js').baseSettings;

router.get('/editor', (req, res, next) => {
    res.render('editor', { entry: '/editorbundle.js'})
})

router.get('/upload', (req, res, next) => {
    res.render('upload');
    return;
});

router.post('/process', (req, res, next) => {
    const { readerName, parserName } = defaultArgs;
    const writerName = req.body.writerName;
    console.log(req.files);
    let docSource;
    if(req.files && req.files.docSource && req.files.docSource.data) {
        docSource = req.files.docSource.data.toString('utf-8');
    } else {
        docSource = req.body.docSourceText;
    }
    console.log(docSource);
    const p = new Parser({});
    const document = newDocument({ sourcePath: '' }, baseSettings);
    if(!docSource) {
	res.setHeader('Content-type', 'text/plain');
	res.writeHead(400);
	res.write('Empty file?');
	res.end();
	return;
    }
    const source = new ioModule.StringInput({source: docSource});
    const destination = new ioModule.StringOutput({});
    const pub = new core.Publisher({ source, destination, settings: baseSettings});
    pub.setComponents(readerName, parserName, writerName);
    return new Promise((resolve, reject) => {
        pub.publish({}, (error, ...args) => {
            if(error) {
                reject(error);
                return;
            }
            res.setHeader('Content-type', `text/${writerName}`);
            res.writeHead(200);
            res.write(destination.destination);
            res.end();
            resolve();
        });
    });
});

router.use('/doc', docutilsServe
	   ({ docPath,
	      createAppElement: (props) => React.createElement(App, props),
	    }))

router.use('/doc-publish', (req, res, next) => {
    if(req.method === "POST") {
	const keys = Object.keys(req.body);
	if(keys.length > 1) {
	    res.setHeader('Content-type', 'text/plain');
	    res.writeHead(400);
	    res.write('Multiple keys in req.body?');
	    res.end();
	    return;
	}
	const docSource = req.body[keys[0]];
	const p = new Parser({});
	const document = newDocument({ sourcePath: '' }, baseSettings);
	if(!docSource) {
	    res.setHeader('Content-type', 'text/plain');
	    res.writeHead(400);
	    res.write('Empty post body?');
	    res.end();
	    return;
	}

	p.parse(docSource, document);
	
	res.setHeader('Content-type', 'text/xml');
	res.writeHead(200);
	res.write(document.toString());
    } else {
	res.setHeader('Content-type', 'text/html');
	res.writeHead(200);
	res.write('hello');
    }
    res.end();
});

router.use('/doc-xml', express.static(docPath))

module.exports = router;
