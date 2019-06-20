import * as fs from 'fs';
import * as path from 'path';
import {Application, NextFunction, Router} from 'express';

const router = Router();

import {
  pojoTranslate, htmlTranslate,
  RSTParser, parse, defaults, newDocument, StringInput, StringOutput, Publisher,
} from 'docutils-js';

const baseSettings = defaults;

router.get('/editor', (req, res, next) => {
  res.render('editor', { entry: '/editorbundle.js' });
});

router.get('/editor2', (req, res, next) => {
  res.render('editor', { entry: '/editorbundle2.js' });
});

router.get('/upload', (req, res, next) => {
  res.render('upload');
});

router.post('/process', (req, res, next) => {
const { writerName } = req.body
let docSource;
  let f ;
  if(Object.prototype.hasOwnProperty.call(req, 'files')) {
  const x = Object.getOwnPropertyDescriptor(req, 'files');
  if(x !== undefined) {
  f = x.value;
  }
}
  if (f && f.docSource && f.docSource.data) {
    docSource = f.docSource.data.toString('utf-8');
  } else {
    docSource = req.body.docSourceText;
  }

  if (!docSource) {
    res.setHeader('Content-type', 'text/plain');
    res.writeHead(400);
    res.write('Empty file?');
    res.end();
    return;
  }
  const document = parse(docSource);
  let output:string = '';
  let contentType:string = 'text/plain';
  if(writerName === 'html') {
    output = htmlTranslate(document);
    contentType = 'text/html';
    } else if(writerName === 'pojo') {
    output = JSON.stringify(pojoTranslate(document), null, 4)
    contentType = 'text/application-json';
    }

  res.setHeader('Content-type', contentType);
  res.writeHead(200);
  res.write(output);
  res.end();
});

/*
router.use('/doc', docutilsServe({
  docPath,
  createAppElement: props => React.createElement(App, props),
}));
*/
router.use('/doc-publish', (req, res, next) => {
  if (req.method === 'POST') {
    const keys = Object.keys(req.body);
    if (keys.length > 1) {
      res.setHeader('Content-type', 'text/plain');
      res.writeHead(400);
      res.write('Multiple keys in req.body?');
      res.end();
      return;
    }
    const docSource = req.body[keys[0]];
    const p = new RSTParser({});
    const document = newDocument({ sourcePath: '' }, baseSettings);
    if (!docSource) {
      res.setHeader('Content-type', 'text/plain');
      res.writeHead(400);
      res.write('Empty post body?');
      res.end();
      return;
    }

    p.parse(docSource, document);

    res.setHeader('Content-type', 'text/xml');
    res.writeHead(200);
    res.write(document.toString());
  } else {
    res.setHeader('Content-type', 'text/html');
    res.writeHead(200);
    res.write('hello');
  }
  res.end();
});

//router.use('/doc-xml', express.static(docPath));

export default router;

