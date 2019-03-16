var fs = require('fs');
var ReactDOMServer = require('react-dom/server');
var setupSaxParser = require('docutils-react/lib/getComponentForXmlSax').setupSaxParser;
var path = require('path');
var React = require('react');
var App = require('../lib/App').default;

/**
 *
 */
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

/**
 *
 */
function streamReader({stream, parser, output}) {
    var chunk;
    while(null !== (chunk = stream.read())) {
        parser.write(chunk);
	output.data = output.data + chunk;
    }
}

/**
 *
 */
function handleDocumentStream({stream, parser, output}) {
    stream.setEncoding('utf8');
    stream.on('readable', () => streamReader({stream, parser, output}));
    return new Promise((resolve, reject) => {
	stream.on('end', () => { parser.close(); resolve({output});}); 
    });
}

/**
 *
 */
function getDocumentStream(options) {
    return (props) => Promise.resolve(fs.createReadStream(path.resolve(options.docPath,
								       props.docName + '.xml')));
}

/**
 *
 */
module.exports = function(options) {
    return async function(req, res, next) {
	const output = { data: '' };
	const xmlFile = req.path.substr(1);
	return new Promise((resolve, reject) => {
	    var parser = getDocumentParser({ resolve, reject});
	    var docName = xmlFile;
	    return getDocumentStream(options)({ parser, docName })
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
	    res.render('doc', { title:'',
				markup,
				xml: output.data,
				entry: "/bundle.js",
			      } );
	}).catch(err => {
	    console.log(err.stack);
	});
    }
}
