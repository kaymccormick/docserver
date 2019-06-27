import { Router } from 'express';
import {createConnection} from '@enterprise-doc-server/core/lib/src/Factory';
import { Module, Project } from 'classModel/lib/src/entity/core';

const router = Router();

router.get('/module(/:projectId)?', async (req, res, next) => {
  return createConnection().then(connection => {
  const repository = connection.getRepository(Module);
            repository.find(req.params.projectId ? { project: { id: req.params.projectId } } : {}	).then(modules => {
	    res.send(JSON.stringify({modules}));
	    connection.close();
            })
  }).catch(error => {
  res.render('error', { message: error.message, error });
  });
});

router.get('/project', async (req, res, next) => {
  return createConnection().then(connection => {
  const repository = connection.getRepository(Project);
            repository.find().then(projects => {
	    res.send(JSON.stringify({projects}));
            })
  }).catch(error => {
  res.render('error', { message: error.message, error });
  });
});
export default router;
