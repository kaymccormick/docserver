import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import {createConnection} from '@enterprise-doc-server/core/lib/src/Factory';
import { StaticRouter } from 'react-router';
//import MainView from '@enterprise-doc-server/core/lib/components/EntityView/MainView';
import * as EntityCore from '@enterprise-doc-server/core/lib/entity/core';

const router = Router();

router.get('/', async (req, res, next) => {
  return createConnection().then(connection => {
  const repository = connection.getRepository(EntityCore.Entity);
            repository.find().then(entities => {
            const jsonData=JSON.stringify({entities});
            const context = {};
	    const markup = '';//ReactDOMServer.renderToStaticMarkup(React.createElement(StaticRouter, { location: req.url, context }, React.createElement(MainView, { entities })));
	      res.render('entityView', { jsonData, markup  });
	      connection.close();
	      });
  }).catch(error => {
  res.render('error', { message: error.message, error });
  });
});
export default router;
