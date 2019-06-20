import {readdirSync, readFileSync} from "fs";
import { parse, pojoTranslate } from 'docutils-js';
import { resolve } from 'path';
const processDir = (dir: string, ...rest: any[]) => {
    const contents = readdirSync(dir, {withFileTypes: true});
    contents.forEach(ent => {
        const p = resolve(dir, ent.name);
        if (ent.isDirectory()) {
            processDir(p, ...rest);
        } else if (ent.isFile()) {
            if (ent.name.toLowerCase().endsWith('.txt') || ent.name.toLowerCase().endsWith('.rst')) {
                console.log(p);
                const src = readFileSync(p, {encoding: 'utf-8'});
                try {
                    const document = parse(src);
                    //console.log(JSON.stringify(pojoTranslate(document)));
                } catch (error) {
                    throw error;
                }
            }
        }
    });
}

export default processDir;
