import { Database, aql } from 'arangojs';

(async function () {
const db = new Database();
db.useBasicAuth('root', '7GUtudrbNiSKfEu%');
const info = await db.createDatabase('mydb');
const collection = db.edgeCollection('fun1');


console.log(info);
})();




