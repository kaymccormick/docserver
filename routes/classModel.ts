import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import ClassModel from '@enterprise-doc-server/core/lib/components/ClassModel';
import {createConnection} from '@enterprise-doc-server/core/lib/src/Factory';
import { EntityCore } from 'classModel';
import { StaticRouter } from 'react-router';

const router = Router();

router.get('/', async (req, res, next) => {
  return createConnection().then(connection => {
  const repository = connection.getRepository(EntityCore.Project);
            repository.find().then(projects => {
            const jsonData=JSON.stringify({projects});
            const context = {};
	    const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(StaticRouter, { location: req.url, context }, React.createElement(ClassModel, { projects: projects })));
	      res.render('classModel', { jsonData, markup  });
	      connection.close();
	      });
  }).catch(error => {
  res.render('error', { message: error.message, error });
  });
});
export default router;
