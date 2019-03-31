require('@babel/polyfill')

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App').default;
var getComponentForXml = require('docutils-react/lib/getComponentForXmlSax').getComponentForXmlSync;

var re = /^\/xml\/(.*)$/
var docName
if(re.test(document.location.pathname)) {
    var result = re.exec(document.location.pathname)
    docName = result[1];
}

var xmlNode = document.getElementById('xml');
var comp = null;
if(xmlNode) {
    comp = getComponentForXml(xmlNode.innerText);
}

ReactDOM.hydrate(<App component={comp} baseHref={document.location.href} docName={docName}/>, document.getElementById('root'))
