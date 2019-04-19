var express = require('express');
var router = express.Router();
var docutilsServe = require('docutils-serve');
var path = require('path');
var App = require('../lib/App').default;
var docPath = path.join(__dirname, '../doc-xml')
var React = require('react')

const Parser = require('docutils-js/lib/parsers/restructuredtext').Parser;
const newDocument = require('docutils-js/lib/newDocument').default;
const baseSettings = require('docutils-js/lib/baseSettings').default;

router.use('/doc', docutilsServe
	   ({ docPath,
	      createAppElement: (props) => React.createElement(App, props),
	    }))

router.use('/doc-publish', (req, res, next) => {
    if(req.method === "POST") {
	const docSource = req.body[''];
	const p = new Parser({});
	const document = newDocument({ sourcePath: '' }, baseSettings);
	if(!docSource) {
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
