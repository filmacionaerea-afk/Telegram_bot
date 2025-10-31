import db from '@packages/db';

// Mock function to simulate calling an external analysis API
async function callAnalysisApi(prompt: string): Promise<string> {
  if (prompt.includes('narrative')) {
    return 'The main narrative of the day is about the rise of AI-powered developer tools.';
  } else if (prompt.includes('sentiment')) {
    return 'Bullish';
  }
  return '';
}

export async function getNarrativeAndSentiment(posts: any[]): Promise<{ narrative: string; sentiment: string }> {
  const narrativePrompt = `Based on the following social media posts, what is the main narrative of the day?\n\n---\n\n${posts.map(p => p.content).join('\n')}`;
  const narrative = await callAnalysisApi(narrativePrompt);

  const sentimentPrompt = `Based on the following narrative, what is the overall market sentiment? (Bullish, Bearish, or Neutral)\n\n---\n\n${narrative}`;
  const sentiment = await callAnalysisApi(sentimentPrompt);

  return { narrative, sentiment };
}

export function saveNarrativeAndSentiment(narrative: string, sentiment: string): void {
  const date = new Date().toISOString().split('T')[0];
  const stmt = db.prepare('INSERT INTO DailyNarratives (date, narrative_summary, sentiment) VALUES (?, ?, ?);');
  stmt.run(date, narrative, sentiment);
}
