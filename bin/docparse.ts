import * as process from 'process';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'docutils-js';

interface Context
{
}

function process2(c: Context, dir: string) {
 const contents = fs.readdirSync(dir, { withFileTypes: true });
 contents.forEach(ent => {
 const p = path.resolve(dir, ent.name);
 if(ent.isDirectory()) {
   process2(c, p);
   } else if(ent.isFile()) {
   if(ent.name.toLowerCase().endsWith('.txt') || ent.name.toLowerCase().endsWith('.rst')) {
      const src = fs.readFileSync(p, {encoding: 'utf-8'});
      console.log = () => {};
      const document = parse(src);
         console.log(document);
}
}
});
}

const [zero, one, dir]: string[] = process.argv;
const c: {} = {};
process2(c, dir);



