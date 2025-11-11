import Database from 'better-sqlite3';
import { config } from '@packages/config';
import path from 'path';
import fs from 'fs';
import { DailyNarrative, NarrativeProbability } from '@packages/types';

const dbPath = path.resolve(process.cwd(), config.databasePath);

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

class NarrativeRepository {
  public saveDailyNarrative(date: string, narrative_summary: string, sentiment: string): number {
    const stmt = db.prepare('INSERT INTO DailyNarratives (date, narrative_summary, sentiment) VALUES (?, ?, ?);');
    const result = stmt.run(date, narrative_summary, sentiment);
    return result.lastInsertRowid as number;
  }

  public getHistoricalNarratives(limit: number): DailyNarrative[] {
    const stmt = db.prepare('SELECT id, date, narrative_summary, sentiment FROM DailyNarratives ORDER BY date DESC LIMIT ?');
    return stmt.all(limit) as DailyNarrative[];
  }

  public saveNarrativeProbability(narrative_id: number, probability_score: number, supporting_posts_ids: string): void {
    const calculation_date = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO NarrativeProbabilities (narrative_id, probability_score, calculation_date, supporting_posts_ids) VALUES (?, ?, ?, ?);');
    stmt.run(narrative_id, probability_score, calculation_date, supporting_posts_ids);
  }

  public getLatestNarrativeWithProbability(): { narrative: DailyNarrative, probability: NarrativeProbability } | null {
    const latestNarrative = db.prepare('SELECT * FROM DailyNarratives ORDER BY date DESC LIMIT 1').get() as DailyNarrative | undefined;

    if (!latestNarrative) {
      return null;
    }

    const probability = db.prepare('SELECT * FROM NarrativeProbabilities WHERE narrative_id = ? ORDER BY calculation_date DESC LIMIT 1').get(latestNarrative.id) as NarrativeProbability | undefined;

    if (!probability) {
      return { narrative: latestNarrative, probability: null as any }; // Return with null probability if not found
    }

    return { narrative: latestNarrative, probability };
  }
}

export const narrativeRepository = new NarrativeRepository();
