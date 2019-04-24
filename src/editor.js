require('@babel/polyfill')

var React = require('react');
var ReactDOM = require('react-dom');
var Editor = require('./Editor').default;

root = document.getElementById('root');
console.log(root);
ReactDOM.hydrate(<Editor/>, root)


