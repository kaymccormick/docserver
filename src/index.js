require('@babel/polyfill')
var React = require('react');
var ReactDOM = require('react-dom');
var DocsViewer = require('./docs').default;

var App = (props) => <DocsViewer/>

ReactDOM.render(<App/>, document.getElementById('root'))
