import { Database, aql } from 'arangojs';

export default function loadData() {
  const db = new Database();
  db.createDatabase('mydb');
}


