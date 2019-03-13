require('@babel/polyfill')
var React = require('react');
var ReactDOM = require('react-dom');
var DocsViewer = require('./docs').default;
var App = require('./App').default;
var getComponentForXml = require('docutils-react/lib/getComponentForXmlSax').getComponentForXmlSync;

var re = /^\/xml\/(.*)$/
var result = re.exec(document.location.pathname)
var docName = result[1];

var xmlNode = document.getElementById('xml');
var comp = getComponentForXml(xmlNode.innerText);
console.log(comp);

ReactDOM.hydrate(<App component={comp} baseHref={document.location.href} docName={docName}/>, document.getElementById('root'))
