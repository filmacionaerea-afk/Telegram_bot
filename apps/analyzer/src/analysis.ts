import axios from 'axios';
import { config } from '../../../packages/config/src/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const narrativePromptTemplate = fs.readFileSync(path.resolve(__dirname, '../narrative_prompt.txt'), 'utf-8');
const sentimentPromptTemplate = fs.readFileSync(path.resolve(__dirname, '../sentiment_prompt.txt'), 'utf-8');
const probabilityPromptTemplate = fs.readFileSync(path.resolve(__dirname, '../probability_prompt.txt'), 'utf-8');

async function callAnalysisApi(prompt: string): Promise<string> {
  const response = await axios.post(
    'https://api.perplexity.ai/chat/completions',
    {
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: 'You are an AI assistant that analyzes crypto narratives.' },
        { role: 'user', content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${config.perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}

export async function getNarrativeAndSentiment(posts: any[]): Promise<{ narrative: string; sentiment: string }> {
  const narrativePrompt = narrativePromptTemplate.replace('{posts}', posts.map(p => p.content).join('\n'));
  const narrative = await callAnalysisApi(narrativePrompt);

  const sentimentPrompt = sentimentPromptTemplate.replace('{narrative}', narrative);
  const sentiment = await callAnalysisApi(sentimentPrompt);

  return { narrative, sentiment };
}

export async function getProbabilityAndEmergingNarratives(
  newNarrative: string,
  historicalNarratives: { summary: string; sentiment: string }[]
): Promise<{ probability_score: number; emerging_narratives: { summary: string; sentiment: 'Bullish' | 'Bearish' | 'Neutral' }[] }> {
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
  } catch (error) {
    console.error('Error parsing Perplexity API response for probability and emerging narratives:', error);
    throw error;
  }
}