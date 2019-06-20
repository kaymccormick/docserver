
const React = require('react')
import ReactDOM from 'react-dom';
const Editor = require('./Editor').default;

const root = document.getElementById('root');
ReactDOM.hydrate(<Editor />, root);
