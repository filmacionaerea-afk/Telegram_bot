"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@packages/config");
const db_1 = require("@packages/db");
const analysis_1 = require("./analysis");
const node_cron_1 = __importDefault(require("node-cron"));
async function runAnalysisCycle() {
    console.log(`[${new Date().toISOString()}] Starting new analysis cycle...`);
    const lastRun = db_1.analysisRunRepository.getLastAnalysisRun();
    console.log('Last analysis run:', lastRun);
    const newPosts = db_1.postRepository.getNewPosts(lastRun);
    console.log('New posts to analyze:', newPosts.length);
    if (newPosts.length > 0) {
        const { narrative, sentiment } = await (0, analysis_1.getNarrativeAndSentiment)(newPosts);
        console.log('Narrative:', narrative);
        console.log('Sentiment:', sentiment);
        const dailyNarrativeId = db_1.narrativeRepository.saveDailyNarrative(new Date().toISOString().split('T')[0], narrative, sentiment);
        console.log('Saved daily narrative and sentiment to the database.');
        const historicalNarratives = db_1.narrativeRepository.getHistoricalNarratives(config_1.config.narrativeHistoryWindow);
        console.log(`Fetched ${historicalNarratives.length} historical narratives.`);
        const { probability_score, emerging_narratives } = await (0, analysis_1.getProbabilityAndEmergingNarratives)(narrative, historicalNarratives.map(n => ({ summary: n.narrative_summary, sentiment: n.sentiment })));
        console.log('Probability Score:', probability_score);
        console.log('Emerging Narratives:', emerging_narratives.length);
        db_1.narrativeRepository.saveNarrativeProbability(dailyNarrativeId, probability_score, newPosts.map(p => p.id).join(','));
        console.log('Saved probability for daily narrative.');
        for (const emergingNarrative of emerging_narratives) {
            const emergingNarrativeId = db_1.narrativeRepository.saveDailyNarrative(new Date().toISOString().split('T')[0], emergingNarrative.summary, emergingNarrative.sentiment);
            // Assuming emerging narratives also get a probability score, or we can set a default/placeholder
            db_1.narrativeRepository.saveNarrativeProbability(emergingNarrativeId, 0, ''); // Placeholder probability and supporting posts
        }
        console.log('Saved emerging narratives.');
    }
    const now = new Date().toISOString();
    db_1.analysisRunRepository.addAnalysisRun(now);
    console.log('Added new analysis run at:', now);
    console.log(`[${new Date().toISOString()}] Analysis cycle finished.`);
}
// Schedule the analyzer to run based on the interval in the .env file
node_cron_1.default.schedule(config_1.config.analysisInterval, runAnalysisCycle);
console.log(`Analyzer service scheduled. Waiting for the first run at interval: ${config_1.config.analysisInterval}`);
//# sourceMappingURL=main.js.map