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

const TABLE_NAME = 'AnalysisRuns';

function getLastAnalysisRun(): string {
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_timestamp TEXT NOT NULL
    );
  `);
  stmt.run();

  const row = db.prepare(`SELECT run_timestamp FROM ${TABLE_NAME} ORDER BY id DESC LIMIT 1`).get() as { run_timestamp: string } | undefined;
  return row ? row.run_timestamp : new Date(0).toISOString();
}

function addAnalysisRun(timestamp: string): void {
  const stmt = db.prepare(`INSERT INTO ${TABLE_NAME} (run_timestamp) VALUES (?)`);
  stmt.run(timestamp);
}

export const analysisRunRepository = {
  getLastAnalysisRun,
  addAnalysisRun,
};