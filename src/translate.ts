import {getBuilderName, builders as b, namedTypes as n} from 'ast-types';
import * as k from 'ast-types/gen/kinds';
import {print} from 'recast';
import * as ts from 'typescript';
import { ok } from 'assert';
import fs from 'fs';

export function translate(node: n.File): string|undefined {
const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed})
const preamble = [b.importDeclaration([
    b.importSpecifier(b.identifier('extend'),
        b.identifier('extend'))], b.literal('./src/translateLib'))]
preamble[0].comments = [b.commentBlock(' Preamble ')]

const body = [...preamble]

const typ:string|undefined = node.type;
if(typ === undefined) {
  throw new Error(`undefined type ${typ}`);
}
const file = b[getBuilderName(typ)].from(node)
fs.writeFileSync('out.ts', print(file).code + "\n", 'utf-8')

let program = ts.createProgram(['out.ts'], {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
})
let checker = program.getTypeChecker();
for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.fileName === 'out.ts') {
        ts.forEachChild(sourceFile, visit(program, checker));
        const resultFile = ts.createSourceFile("out2.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
        const result = printer.printNode(ts.EmitHint.Unspecified, sourceFile, resultFile)
	return result;
    }
}
return undefined;
}

function visit(program: any, checker: any) {
    return (node: ts.Node) => {
        const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed})
        const resultFile = ts.createSourceFile("temp.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
        if(ts.isMethodDeclaration(node)) {
            let symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                const node1 = symbol.valueDeclaration!;
		const sig = checker.getSignatureFromDeclaration(node)
		if(sig) {
                const typ = checker.getReturnTypeOfSignature(sig);
                node.type = checker.typeToTypeNode(typ)
                const t = checker.typeToString(
                    typ)
}
	    }
        } else if (ts.isVariableDeclaration(node)) {
            let symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                const node1 = symbol.valueDeclaration!;
                const tt = checker.getTypeOfSymbolAtLocation(symbol, node1);
                const new_node = ts.createVariableDeclaration(node.name, checker.typeToTypeNode(tt), node.initializer)
                node.type = checker.typeToTypeNode(tt)
                const t = checker.typeToString(
                    tt)

                /*                if('declarations' in node.parent) {
                        const index = node.parent.declarations.indexOf(node)
                        ok(index !== -1)
                        const decl = [...node.parent.declarations]
                        decl[index] = new_node
                        node.parent.declarations = decl
                    }
    		*/
                //return new_node;
            }
            ts.forEachChild(node, visit(program, checker));
        } else {
            ts.forEachChild(node, visit(program, checker));
        }
    };
}


