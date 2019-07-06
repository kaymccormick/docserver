import { Router } from 'express';
import { Module, Project } from 'classModel/lib/src/entity/core';
import {EntityCore, TypeManager} from 'classModel';
import { Connection } from 'typeorm';
import{reconstructAst} from'../src/astUtils';

const router = Router();

router.post('/tstype', async (req, res, next) => {
  const connection: Connection = req.app.get('connection');
  const tm: TypeManager = req.app.get('typeManager');
  const x = req.body.tstype;
  const astNode = reconstructAst(x.astNode);
  if(!x.origin) {
  throw new Error('need origin');
  }
  return tm.createType(x.moduleId, astNode, x.origin).then(tstype => {
  if(!tstype) {
  throw new Error('undefined tstype');
  }
  console.log(`put ${JSON.stringify(tstype)}`);
  res.send(JSON.stringify({success:true, tstype}));
    //  const ast= reconstructAst(req.body.tstype.astNode);
    }).catch((error: Error): void => {
    res.send(JSON.stringify({success: false, error: error.message, stack: error.stack}));
    });
});

router.post('/tstype/find/:moduleId', async (req, res, next) => {
  const connection: Connection = req.app.get('connection');
  console.log(req.body);
  const tm: TypeManager = req.app.get('typeManager');
  const moduleId = req.params.moduleId;
  const astNode = req.body.astNode;
  return tm.findType(moduleId, astNode).then(tstype => {
  res.send(JSON.stringify({tstype}));
  });
  });

export default router;
