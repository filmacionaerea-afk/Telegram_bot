import db from './index.js';
import { schema } from './schema.js';

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