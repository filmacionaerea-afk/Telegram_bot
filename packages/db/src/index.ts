import Database from 'better-sqlite3';
import { config } from '@packages/config';
import path from 'path';

const dbPath = path.resolve(process.cwd(), config.databasePath);

const db = new Database(dbPath);

export default db;
