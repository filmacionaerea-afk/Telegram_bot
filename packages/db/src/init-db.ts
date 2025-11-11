import Database from 'better-sqlite3';
import { config } from '@packages/config';
import path from 'path';
import fs from 'fs';
import { schema } from './schema';

const dbPath = path.resolve(process.cwd(), config.databasePath);

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

function initDb() {
  try {
    db.exec('DROP TABLE IF EXISTS NarrativeProbabilities;');
    db.exec('DROP TABLE IF EXISTS DailyNarratives;');
    db.exec('DROP TABLE IF EXISTS Posts;');
    db.exec('DROP TABLE IF EXISTS Influencers;');
    db.exec('DROP TABLE IF EXISTS AnalysisRuns;');
    db.exec(schema);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();