import { config } from '@packages/config';
import db from '@packages/db';
import { getNarrativeAndSentiment, saveNarrativeAndSentiment } from './analysis';
import { postRepository } from '@packages/db/src/PostRepository';

function getLastAnalysisRun(): string {
  const stmt = db.prepare('SELECT run_timestamp FROM AnalysisRuns ORDER BY run_timestamp DESC LIMIT 1;');
  const result = stmt.get() as { run_timestamp: string } | undefined;
  return result ? result.run_timestamp : '1970-01-01T00:00:00Z';
}

function getNewPosts(since: string): any[] {
  const stmt = db.prepare('SELECT * FROM Posts WHERE timestamp > ?;');
  return stmt.all(since);
}

function addAnalysisRun(timestamp: string): void {
  const stmt = db.prepare('INSERT INTO AnalysisRuns (run_timestamp) VALUES (?);');
  stmt.run(timestamp);
}

async function main() {
  console.log('Analyzer service running...');

  // Add a dummy post for testing
  const dummyPost = {
    influencer_id: 1,
    post_url: 'https://twitter.com/test/status/123',
    content: 'This is a test post about AI developer tools.',
    views: 100,
    comments: 10,
    interactions: 50,
    timestamp: new Date().toISOString(),
  };
  postRepository.addPost(dummyPost);
  console.log('Added dummy post.');

  const lastRun = getLastAnalysisRun();
  console.log('Last analysis run:', lastRun);

  const newPosts = getNewPosts(lastRun);
  console.log('New posts to analyze:', newPosts.length);

  if (newPosts.length > 0) {
    const { narrative, sentiment } = await getNarrativeAndSentiment(newPosts);
    console.log('Narrative:', narrative);
    console.log('Sentiment:', sentiment);
    saveNarrativeAndSentiment(narrative, sentiment);
    console.log('Saved narrative and sentiment to the database.');
  }

  // Add a new analysis run for the current time
  const now = new Date().toISOString();
  addAnalysisRun(now);
  console.log('Added new analysis run at:', now);
}

main();

