require('@babel/polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const Editor = require('./Editor').default;

const root = document.getElementById('root');
ReactDOM.hydrate(<Editor />, root);
