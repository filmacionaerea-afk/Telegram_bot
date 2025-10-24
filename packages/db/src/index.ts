console.log('db/index.ts: Before Database import');
import Database from 'better-sqlite3';
console.log('db/index.ts: After Database import, before config import');
import config from '@packages/config';
console.log('db/index.ts: After config import');

console.log('db/index.ts: Before new Database()');
const db = new Database(config.database.path || './db/database.sqlite');
console.log('db/index.ts: After new Database()');

export default db;
