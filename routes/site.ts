import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import { getSite } from '../src/getSite'
import App from '../src/App';
import React from 'react';
const site = getSite();
const router = Router();
router.use('/', (req, res, next) => {
    const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(App))
    res.render('index', { markup });
});

export default router;
