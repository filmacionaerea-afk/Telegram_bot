import Database from 'better-sqlite3';
import { schema } from './schema';
import config from '@packages/config';
import fs from 'fs';
import path from 'path';

const dbPath = config.database.path || './db/database.sqlite';

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(schema);

console.log('Database initialized successfully.');

db.close();
