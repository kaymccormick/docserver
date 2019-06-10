Database = require('arangojs').Database;

db = new Database();
db.useBasicAuth('jade', 'waffles');
// db.createDatabase('dox').then(() => console.log('database created')).catch((err) => console.log(err))
db.useDatabase('dox');
doctree_collection = db.collection('doctree');
collection.exists().then((e) => {
  if (!e) {
    return collection.create();
  }
}).then(() => console.log('collection created?')).catch(err => console.log('unable to create collection'));
collection.save({ elementName: 'document', desc: 'Root element' }).catch(err => console.log(err));
// console.log(collection)
