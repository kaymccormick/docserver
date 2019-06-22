import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Main from '@enterprise-doc-server/core/lib/components/Main';

const router = Router();

router.get('/', (req, res, next) => {
  res.render('main', { markup: ReactDOMServer.renderToStaticMarkup(React.createElement(Main)) });
});
export default router;
