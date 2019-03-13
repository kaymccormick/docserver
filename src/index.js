require('@babel/polyfill')
var React = require('react');
var ReactDOM = require('react-dom');
var DocsViewer = require('./docs').default;

var re = /^\/xml\/(.*)$/
var result = re.exec(document.location.pathname)
var docName = result[1];


var App = (props) => <DocsViewer {...props}/>

    ReactDOM.hydrate(<App baseHref={document.location.href} docName={docName}/>, document.getElementById('root'))
