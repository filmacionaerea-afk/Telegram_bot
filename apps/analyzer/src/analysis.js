"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNarrativeAndSentiment = getNarrativeAndSentiment;
exports.getProbabilityAndEmergingNarratives = getProbabilityAndEmergingNarratives;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../../../packages/config/src/index");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const narrativePromptTemplate = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../narrative_prompt.txt'), 'utf-8');
const sentimentPromptTemplate = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../sentiment_prompt.txt'), 'utf-8');
const probabilityPromptTemplate = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../probability_prompt.txt'), 'utf-8');
async function callAnalysisApi(prompt) {
    const response = await axios_1.default.post('https://api.perplexity.ai/chat/completions', {
        model: 'sonar-pro',
        messages: [
            { role: 'system', content: 'You are an AI assistant that analyzes crypto narratives.' },
            { role: 'user', content: prompt },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${index_1.config.perplexityApiKey}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.choices[0].message.content;
}
async function getNarrativeAndSentiment(posts) {
    const narrativePrompt = narrativePromptTemplate.replace('{posts}', posts.map(p => p.content).join('\n'));
    const narrative = await callAnalysisApi(narrativePrompt);
    const sentimentPrompt = sentimentPromptTemplate.replace('{narrative}', narrative);
    const sentiment = await callAnalysisApi(sentimentPrompt);
    return { narrative, sentiment };
}
async function getProbabilityAndEmergingNarratives(newNarrative, historicalNarratives) {
    const historicalNarrativesString = historicalNarratives.map(n => `- ${n.summary} (${n.sentiment})`).join('\n');
    const prompt = probabilityPromptTemplate
        .replace('{historical_narratives}', historicalNarrativesString)
        .replace('{new_daily_narrative}', newNarrative);
    const response = await callAnalysisApi(prompt);
    try {
        const parsedResponse = JSON.parse(response);
        // Basic validation
        if (typeof parsedResponse.probability_score === 'number' && Array.isArray(parsedResponse.emerging_narratives)) {
            return parsedResponse;
        }
        throw new Error('Invalid response format from Perplexity API for probability and emerging narratives.');
    }
    catch (error) {
        console.error('Error parsing Perplexity API response for probability and emerging narratives:', error);
        throw error;
    }
}
//# sourceMappingURL=analysis.js.map