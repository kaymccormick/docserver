import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import loadData from './loadData';

const root = document.getElementById('app');
ReactDOM.hydrate(<App/>, root);
