var express = require('express');
var router = express.Router();
var fs = require('fs');
var ReactDOMServer = require('react-dom/server');
var setupSaxParser = require('docutils-react/lib/getComponentForXmlSax').setupSaxParser;
var promisify = require('util').promisify;
var open = promisify(fs.open);
var path = require('path');
var React = require('react');
var App = require('../lib/App').default;

function getDocumentParser({ resolve, reject }) {
    var context = {};
    var { parser } = setupSaxParser({context});
    parser.onend = () => {
	var nodes = context.siblings[0].map(f => f());
	var r = nodes.filter(React.isValidElement)[0];
	if(!React.isValidElement(r)) {
	    reject(new Error("Invalid Element"));
	}
	var data = context.nodes[0].dataChildren.map(f => f()).filter(e => e[0] === 'document')[0];
	resolve({ component: r });
    };
    return parser;
}

function streamReader({stream, parser, output}) {
    var chunk;
    while(null !== (chunk = stream.read())) {
        parser.write(chunk);
	output.data = output.data + chunk;
    }
}

function handleDocumentStream({stream, parser, output}) {
    stream.setEncoding('utf8');
    stream.on('readable', () => streamReader({stream, parser, output}));
    return new Promise((resolve, reject) => {
	stream.on('end', () => { parser.close(); resolve({output});}); 
    });
}

function getDocumentStream(props) {
    return Promise.resolve(fs.createReadStream(path.resolve('./static/static/xml', props.docName + '.xml')));
}

/* GET home page. */
router.get('/:xmlFile', async function(req, res, next) {
    const output = { data: '' };
    return new Promise((resolve, reject) => {
	var parser = getDocumentParser({ resolve, reject});
	var docName = req.params.xmlFile;
	return getDocumentStream({ parser, docName})
	    .then((stream) => {
		if(!stream) {
		} else {
		    handleDocumentStream({ stream, parser, output }).then(o => {
			console.log(o);
		    });
		}
	    }).catch(reject);
    }).then(o => {
	var app = React.createElement(App, { component: o.component });
	return ReactDOMServer.renderToStaticMarkup(app);
    }).then(markup => {
	res.render('doc', { title:'', markup, xml: output.data });
	}).catch(err => {
	    console.log(err.stack);
	});
});

module.exports = router;
