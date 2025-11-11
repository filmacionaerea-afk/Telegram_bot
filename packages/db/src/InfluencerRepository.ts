import Database from 'better-sqlite3';
import { config } from '@packages/config';
import path from 'path';
import fs from 'fs';
import { Influencer } from '@packages/types';

const dbPath = path.resolve(process.cwd(), config.databasePath);

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

class InfluencerRepository {
  public getAllInfluencers(): Influencer[] {
    return db.prepare('SELECT * FROM Influencers').all() as Influencer[];
  }
}

export const influencerRepository = new InfluencerRepository();
