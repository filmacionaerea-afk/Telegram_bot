import db from './index.js';

class AnalysisRunRepository {
  public getLastAnalysisRun(): string {
    const stmt = db.prepare('SELECT run_timestamp FROM AnalysisRuns ORDER BY run_timestamp DESC LIMIT 1;');
    const result = stmt.get() as { run_timestamp: string } | undefined;
    return result ? result.run_timestamp : '1970-01-01T00:00:00Z';
  }

  public addAnalysisRun(timestamp: string): void {
    const stmt = db.prepare('INSERT INTO AnalysisRuns (run_timestamp) VALUES (?);');
    stmt.run(timestamp);
  }
}

export const analysisRunRepository = new AnalysisRunRepository();
