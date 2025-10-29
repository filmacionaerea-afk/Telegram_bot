import Database from 'better-sqlite3';
import { schema } from './schema';
import { config } from '@packages/config';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), config.databasePath);
const dbDir = path.dirname(dbPath);

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

export function initializeDatabase() {
  try {
    db.exec(schema);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  initializeDatabase();
}
