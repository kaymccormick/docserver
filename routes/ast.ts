import expressPromiseRouter from 'express-promise-router';
import { getBuilderName, builders as b, namedTypes as n } from 'ast-types';
import { print } from 'recast';
import { translate } from '../src/translate'

const router = expressPromiseRouter();
router.post('/check-ast', (req, res, next) => {
  const logger  = req.app.get('logger');
  const astNode = req.body.astNode;
  const builderName = getBuilderName(astNode.type);
  const builder= b[builderName];
  try {
    const result = builder.from(astNode)
    const code = print(result).code;
    res.writeHead(200);
    res.write(code);
    res.end();
  } catch(error) {
    res.setHeader('Content-type', 'text/plain');
    res.writeHead(401);
    res.write(error.message);
    logger.error(error.message)
    res.end()
  }
});

router.post('/codegen', (req, res, next) => {
  const logger  = req.app.get('logger');
  const astNode = req.body.file;
  try {
    const result = b.file.from(astNode)
    const code = print(result).code;
    res.setHeader('Content-type', 'application/x-typescript');
    res.writeHead(200);
    res.write(code + '\n');
    res.end();
  } catch(error) {
    res.setHeader('Content-type', 'text/plain');
    res.writeHead(401);
    res.write(error.message);
    logger.error(error.message)
    res.end()
    throw error;
  }
});

export default router;
