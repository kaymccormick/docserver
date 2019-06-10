require('@babel/polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const App2 = require('./App2').default;

ReactDOM.hydrate(<App2/>, document.getElementById('root'));
