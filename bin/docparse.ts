import * as process from 'process';
import * as fs from 'fs';
import * as path from 'path';
import { parse, pojoTranslate } from 'docutils-js';
import { Database, aql } from 'arangojs';
import processDir from '../src/filesystem/processDocs';

function initDb(): Database {
  return new Database();
}

interface Context
{
}

const [zero, one, dir]: string[] = process.argv;
console.log(dir);
const c: {} = {};
processDir(dir, c);



