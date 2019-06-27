import { Router } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import ClassModel from '@enterprise-doc-server/core/lib/components/ClassModel';
import {createConnection} from '@enterprise-doc-server/core/lib/src/Factory';
import { Module } from 'classModel/lib/src/entity/core';

const router = Router();

router.get('/', async (req, res, next) => {
  return createConnection().then(connection => {
  const repository = connection.getRepository(Module);
            repository.find().then(modules => {

            })
        }).then(() => {
  res.render('classModel', { markup: ReactDOMServer.renderToStaticMarkup(React.createElement(ClassModel, { })) });
  }).catch(error => {
  res.render('error', { error });
  });
});
export default router;
