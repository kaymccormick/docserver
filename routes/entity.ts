import { Router } from 'express';
import { Module, Project } from 'classModel/lib/src/entity/core';
import * as EntityCore from '@enterprise-doc-server/core/lib/entity/core';
import { Connection } from 'typeorm';

const router = Router();

router.get('/module(/:projectId)?', async (req, res, next) => {
  const connection: Connection = req.app.get('connection');
  const repository = connection.getRepository(Module);
  repository.find(req.params.projectId ? { project: { id: req.params.projectId } } : {}	).then((modules: Module[]) => {
	    res.send(JSON.stringify({modules}));
	    connection.close();
});
});

router.get('/entity', async (req, res, next) => {
  const connection: Connection = req.app.get('connection');
  const repository = connection.getRepository(EntityCore.Entity);
            repository.find().then(entities => {
	    res.send(JSON.stringify({entities}));
            })
  .catch(error => {
  res.render('error', { message: error.message, error });
  });
});

router.get('/project', async (req, res, next) => {
  const connection: Connection = req.app.get('connection');
  const repository = connection.getRepository(Project);
            repository.find().then(projects => {
	    res.send(JSON.stringify({projects}));
  }).catch(error => {
  res.render('error', { message: error.message, error });
  });
});

export default router;
