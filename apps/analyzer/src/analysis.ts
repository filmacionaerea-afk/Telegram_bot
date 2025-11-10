import axios from 'axios';
import { config } from '../../../packages/config/src/index.js';
import db from '../../../packages/db/src/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const narrativePromptTemplate = fs.readFileSync(path.resolve(__dirname, '../narrative_prompt.txt'), 'utf-8');
const sentimentPromptTemplate = fs.readFileSync(path.resolve(__dirname, '../sentiment_prompt.txt'), 'utf-8');

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

export function saveNarrativeAndSentiment(narrative: string, sentiment: string): void {
  const date = new Date().toISOString().split('T')[0];
  const stmt = db.prepare('INSERT INTO DailyNarratives (date, narrative_summary, sentiment) VALUES (?, ?, ?);');
  stmt.run(date, narrative, sentiment);
}
