const fs = require('fs');
const ReactDOMServer = require('react-dom/server');
const { setupSaxParser } = require('docutils-react/lib/getComponentForXmlSax');
const path = require('path');
const React = require('react');
const App = require('../lib/App').default;

/**
 *
 */
function getDocumentParser({ resolve, reject }) {
  const context = {};
  const { parser } = setupSaxParser({ context });
  parser.onend = () => {
    const nodes = context.siblings[0].map(f => f());
    const r = nodes.filter(React.isValidElement)[0];
    if (!React.isValidElement(r)) {
      reject(new Error('Invalid Element'));
    }
    const data = context.nodes[0].dataChildren.map(f => f()).filter(e => e[0] === 'document')[0];
    resolve({ component: r });
  };
  return parser;
}

/**
 *
 */
function streamReader({ stream, parser, output }) {
  let chunk;
  while ((chunk = stream.read()) !== null) {
    parser.write(chunk);
    output.data += chunk;
  }
}

/**
 *
 */
function handleDocumentStream({ stream, parser, output }) {
  stream.setEncoding('utf8');
  stream.on('readable', () => streamReader({ stream, parser, output }));
  return new Promise((resolve, reject) => {
    stream.on('end', () => { parser.close(); resolve({ output }); });
  });
}

/**
 *
 */
function getDocumentStream(options) {
  return props => Promise.resolve(fs.createReadStream(path.resolve(options.docPath,
    `${props.docName}.xml`)));
}

/**
 *
 */
module.exports = function (options) {
  return async function (req, res, next) {
    const output = { data: '' };
    const xmlFile = req.path.substr(1);
    return new Promise((resolve, reject) => {
      const parser = getDocumentParser({ resolve, reject });
      const docName = xmlFile;
      return getDocumentStream(options)({ parser, docName })
        .then((stream) => {
          if (!stream) {
          } else {
            handleDocumentStream({ stream, parser, output }).then((o) => {
              console.log(o);
            });
          }
        }).catch(reject);
    }).then((o) => {
      const app = React.createElement(App, { component: o.component });
      return ReactDOMServer.renderToStaticMarkup(app);
    }).then((markup) => {
      res.render('doc', {
        title: '',
        markup,
        xml: output.data,
        entry: '/bundle.js',
      });
    }).catch((err) => {
      console.log(err.stack);
    });
  };
};
