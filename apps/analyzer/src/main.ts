import { config } from '@packages/config';
import { postRepository, analysisRunRepository, narrativeRepository } from '@packages/db';
import { getNarrativeAndSentiment, getProbabilityAndEmergingNarratives } from './analysis.js';
import { DailyNarrative, Post } from '@packages/types';
import cron from 'node-cron';

async function runAnalysisCycle() {
  console.log(`[${new Date().toISOString()}] Starting new analysis cycle...`);

  const lastRun = analysisRunRepository.getLastAnalysisRun();
  console.log('Last analysis run:', lastRun);

  const newPosts = postRepository.getNewPosts(lastRun);
  console.log('New posts to analyze:', newPosts.length);

  if (newPosts.length > 0) {
    const { narrative, sentiment } = await getNarrativeAndSentiment(newPosts);
    console.log('Narrative:', narrative);
    console.log('Sentiment:', sentiment);
    const dailyNarrativeId = narrativeRepository.saveDailyNarrative(new Date().toISOString().split('T')[0], narrative, sentiment);
    console.log('Saved daily narrative and sentiment to the database.');

    const historicalNarratives: DailyNarrative[] = narrativeRepository.getHistoricalNarratives(config.narrativeHistoryWindow);
    console.log(`Fetched ${historicalNarratives.length} historical narratives.`);

    const { probability_score, emerging_narratives } = await getProbabilityAndEmergingNarratives(
      narrative,
      historicalNarratives.map(n => ({ summary: n.narrative_summary, sentiment: n.sentiment }))
    );
    console.log('Probability Score:', probability_score);
    console.log('Emerging Narratives:', emerging_narratives.length);

    narrativeRepository.saveNarrativeProbability(dailyNarrativeId, probability_score, newPosts.map((p: Post) => p.id).join(','));
    console.log('Saved probability for daily narrative.');

    for (const emergingNarrative of emerging_narratives) {
      const emergingNarrativeId = narrativeRepository.saveDailyNarrative(
        new Date().toISOString().split('T')[0],
        emergingNarrative.summary,
        emergingNarrative.sentiment
      );
      // Assuming emerging narratives also get a probability score, or we can set a default/placeholder
      narrativeRepository.saveNarrativeProbability(emergingNarrativeId, 0, ''); // Placeholder probability and supporting posts
    }
    console.log('Saved emerging narratives.');
  }

  const now = new Date().toISOString();
  analysisRunRepository.addAnalysisRun(now);
  console.log('Added new analysis run at:', now);
  console.log(`[${new Date().toISOString()}] Analysis cycle finished.`);
}

// Schedule the analyzer to run based on the interval in the .env file
cron.schedule(config.analysisInterval, runAnalysisCycle);

console.log(`Analyzer service scheduled. Waiting for the first run at interval: ${config.analysisInterval}`);