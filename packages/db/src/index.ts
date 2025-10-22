import Database from 'better-sqlite3';
import config from '@packages/config';

const db = new Database(config.database.path || './db/database.sqlite');

export default db;
