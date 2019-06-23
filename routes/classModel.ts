import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import ClassModel from '@enterprise-doc-server/core/lib/components/ClassModel';
import { SimpleRegistry } from 'classModel/lib';

const router = Router();

const registry = new SimpleRegistry({load: true});

router.get('/', (req, res, next) => {
  res.render('classModel', { markup: ReactDOMServer.renderToStaticMarkup(React.createElement(ClassModel, { registry })) });
});
export default router;
