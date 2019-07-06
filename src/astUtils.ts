import { getBuilderName,namedTypes,builders, getFieldNames, getFieldValue } from 'ast-types';
import camelCase from 'camelcase'

export function reconstructAst(node: namedTypes.Node ) {
   const type = node.type;
   const fieldNames = getFieldNames(node);
   
//   console.log(Object.keys(builders));
   const k = getBuilderName(node.type);
   const astNode = builders[k].from(node);
   delete astNode.loc;
   delete astNode.comments;
   return astNode;
}
