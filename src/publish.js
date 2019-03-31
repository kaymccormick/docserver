require('@babel/polyfill')

var React = require('react');
var ReactDOM = require('react-dom');
var App2 = require('./App2').default;

ReactDOM.hydrate(<App2/>, document.getElementById('root'))

