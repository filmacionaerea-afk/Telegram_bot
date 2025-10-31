import Database from 'better-sqlite3';
import { config } from '@packages/config';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), config.databasePath);

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

export default db;
