import { Router } from 'express';
import { Module, Project } from 'classModel/lib/src/entity/core';
import {TypeManager} from 'classModel';
import EntityCore from 'classModel/lib/src/entityCore';

import { ServerModule as ClassModelModule } from '@enterprise-doc-server/core/lib/modules/classModel/ServerModule';

import { Connection, EntityMetadata, } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import{reconstructAst} from'../src/astUtils';
import {Application} from '@enterprise-doc-server/core';
import {EntityPojo,EntityColumnPojo} from '@enterprise-doc-server/core/lib/modules/entities/types';

const router = Router();

function basicCopy(o: any) {
    const out: { [a: string]: any} = {};
    Object.keys(o).forEach(k => {
        // @ts-ignore
        const  v = o[k];
        if(typeof v !== 'object') {
            // @ts-ignore
            out[k] = v;
        }
    });
    return out;
}

router.get('/entity', (req, res, next) => {
    const ary: EntityPojo[] = [];
    const app: Application = req.app.get('Application');

    const defaultFilter = (e: EntityMetadata) => e.tableType === 'regular';
    app.connection!.entityMetadatas.filter(defaultFilter)
        .forEach((e: EntityMetadata) => {
            const out: EntityPojo = {};
            Object.keys(e).forEach(k => {
                // @ts-ignore
                const  v = e[k];
                if(typeof v !== 'object') {
                    // @ts-ignore
                    out[k] = v;
                }
            });
            // @ts-ignore
            ary.push(out);
            out.columns = e.ownColumns.map((c: ColumnMetadata): EntityColumnPojo => (basicCopy(c)));
        });
        
    res.send(JSON.stringify({success: true, result: ary}));
});

router.get('/entity/:tableName', async (req, res, next) => {
    const app = req.app.get('Application');
    const metadata = app.connection!.getMetadata(req.params.tableName);
    if(!metadata) {
        next();
    }

    const relations: string[] = [];
    metadata.ownRelations.forEach((rm: RelationMetadata) => {
        if(rm.propertyName) {
            relations.push(rm.propertyName);
        }
        console.log(rm.target);
        console.log(rm.propertyName);
        console.log(rm.type);

    });

    return app.connection!.getRepository(metadata.target).find({relations}).then((results: any[]) => {
        res.send(JSON.stringify({success: true, results}));
    });
});

router.post('/entity/:tableName/find', async (req, res, next) => {
    const app = req.app.get('Application');
    const metadata = app.connection!.getMetadata(req.params.tableName);
    if(!metadata) {
        next();
    }

    const where = req.body.where;

    return app.connection!.getRepository(metadata.target).find({where}).then((results: any[]) => {
        res.send(JSON.stringify({success: true, results}));
    });
});

/*router.get('/entities', (req, res, next) => {
    const ary: EntityPojo[] = [];
    const app: Application = req.app.get('Application');
    app.connection!.entityMetadatas.forEach((e: EntityMetadata) => {
        const out: EntityPojo = {};
        Object.keys(e).forEach(k => {
            // @ts-ignore
            const  v = e[k];
            if(typeof v !== 'object') {
                // @ts-ignore
                out[k] = v;
            }
        });
        //@ts-ignore
            out.columns = e.ownColumns.map((c:ColumnMetadata)=> ({ propertyName: c.propertyName, type: c.type }));
        ary.push(out);
    });
    res.send(JSON.stringify({success: true, result: ary}));
});
*/
router.get('/project(/:relations)?',async (req, res, next) => {
    const app: Application = req.app.get('Application');
    const connection: Connection = app.connection!;
    const repository = connection.getRepository(EntityCore.Project);
    const relations = req.params.relations;
    const o = {relations: relations ? relations.split(','):[]};
    console.log(o);
    return repository.find(o).then(projects => {
        res.send(JSON.stringify({success: true, projects:projects.map(p => p.toPojo())}));
    });
});

router.get('/class(/:moduleId)?', async (req, res, next) => {
    const connection: Connection = req.app.get('connection');
    const repository = connection.getRepository(EntityCore.Class);
    return repository.find(req.params.moduleId ? { moduleId: req.params.moduleId } : {}).then((classes) => {
        res.send(JSON.stringify({success: true, classes}));
    });
});

router.get('/module(/:projectId)?', async (req, res, next) => {
    const connection: Connection = req.app.get('connection');
    const repository = connection.getRepository(Module);
    return repository.find(req.params.projectId ? { project: { id: req.params.projectId } } : {}	).then((modules: Module[]) => {
	    res.send(JSON.stringify({modules}));
    });
});

router.post('/tstype', async (req, res, next) => {
    const app = req.app.get('Application');
    const mod: ClassModelModule = app.getModule('classModel') as ClassModelModule;
    const connection: Connection = req.app.get('connection');
    const tm  = mod.typeManager;
    const logger  = req.app.get('logger');
    logger.debug('test');
    const x = req.body.tstype;
    const astNode = reconstructAst(x.astNode);
    if(!x.origin) {
        throw new Error('need origin');
    }
    return tm.createType(x.moduleId, astNode, x.origin).then((tstype: EntityCore.TSType|undefined) => {
        if(!tstype) {
            throw new Error('undefined tstype');
        }
        res.send(JSON.stringify({success:true, tstype: tstype.toPojo()}));
    //  const ast= reconstructAst(req.body.tstype.astNode);
    }).catch((error: Error): void => {
        res.send(JSON.stringify({success: false, error: error.message, stack: error.stack}));
    });
});

router.post('/tstype/find/:moduleId', async (req, res, next) => {
    const app: Application = req.app.get('Application');
    const connection: Connection = req.app.get('connection');
    const mod: ClassModelModule = app.getModule('classModel') as ClassModelModule;
    const tm  = mod.typeManager;
    
    const logger  = req.app.get('logger');
    const moduleId = req.params.moduleId;
    const astNode = req.body.astNode;
    logger.info({operation: 'findType', astNode});
    return tm.findType(moduleId, astNode).then(tstype => {
        res.send(JSON.stringify({success: true, tstype: tstype ? tstype.toPojo() : undefined }));
    }).catch((error: Error): void => {
        res.send(JSON.stringify({success: false, error: error.message, stack: error.stack}));
    });
});

export default router;

