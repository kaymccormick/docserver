import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('app');
ReactDOM.hydrate(<App/>, root);
