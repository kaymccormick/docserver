require('@babel/polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const Editor = require('./Editor2').default;

const root = document.getElementById('root');
ReactDOM.hydrate(<Editor />, root);
