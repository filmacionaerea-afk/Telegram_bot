import { config } from '@packages/config';
import { postRepository, analysisRunRepository, narrativeRepository } from '@packages/db';
import { getNarrativeAndSentiment } from './analysis';

async function main() {
  console.log('Analyzer service running...');

  const lastRun = analysisRunRepository.getLastAnalysisRun();
  console.log('Last analysis run:', lastRun);

  const newPosts = postRepository.getNewPosts(lastRun);
  console.log('New posts to analyze:', newPosts.length);

  if (newPosts.length > 0) {
    const { narrative, sentiment } = await getNarrativeAndSentiment(newPosts);
    console.log('Narrative:', narrative);
    console.log('Sentiment:', sentiment);
    narrativeRepository.saveDailyNarrative(new Date().toISOString().split('T')[0], narrative, sentiment);
    console.log('Saved narrative and sentiment to the database.');
  }

  const now = new Date().toISOString();
  analysisRunRepository.addAnalysisRun(now);
  console.log('Added new analysis run at:', now);
}

main();