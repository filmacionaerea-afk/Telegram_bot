import { DailyNarrative, NarrativeProbability, Post } from '@packages/types';

export function formatPrivateReport(
  narrative: DailyNarrative,
  probability: NarrativeProbability,
  supportingPosts: Post[]
): string {
  let report = `*🚨 Crypto Narrative Alert - Detailed Report 🚨*\n\n`;

  report += `*Narrative:* ${narrative.narrative_summary}\n`;
  report += `*Sentiment:* ${narrative.sentiment}\n`;
  report += `*Probability Score:* ${ (probability.probability_score * 100).toFixed(2)}%\n\n`;

  if (supportingPosts.length > 0) {
    report += `*Supporting Posts:*\n`;
    supportingPosts.forEach((post, index) => {
      report += `  ${index + 1}. [${post.content.substring(0, 50)}...](${post.post_url})\n`;
    });
    report += `\n`;
  }

  // Placeholder for emerging narratives (will be added later)
  report += `_Emerging Narratives: (Coming Soon)_\n`;

  return report;
}

export function formatPublicSummary(
  narrative: DailyNarrative,
  probability: NarrativeProbability
): string {
  let summary = `*📢 Crypto Narrative Update 📢*\n\n`;
  summary += `*Narrative:* ${narrative.narrative_summary}\n`;
  summary += `*Sentiment:* ${narrative.sentiment}\n`;
  summary += `*Probability:* ${ (probability.probability_score * 100).toFixed(2)}%\n`;
  summary += `\n_Stay tuned for more detailed insights!_`;

  return summary;
}
