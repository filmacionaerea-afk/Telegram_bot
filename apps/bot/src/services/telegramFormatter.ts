import type { DailyNarrative, NarrativeProbability, Post } from '@packages/types';

export function formatPrivateReport(
  narrative: DailyNarrative,
  probability: NarrativeProbability,
  supportingPosts: Post[],
  emergingNarratives: { narrative: DailyNarrative, probability: NarrativeProbability | null }[] = []
): string {
  let report = `*🚨 Crypto Narrative Alert - Detailed Report 🚨*\\n\\n`;

  report += `*Narrative:* ${narrative.narrative_summary}\\n`;
  report += `*Sentiment:* ${narrative.sentiment}\\n`;
  report += `*Probability Score:* ${(probability.probability_score * 100).toFixed(2)}%\\n\\n`;

  if (supportingPosts.length > 0) {
    report += `*Supporting Posts:*\\n`;
    supportingPosts.forEach((post, index) => {
      report += `  ${index + 1}. [${post.content.substring(0, 50)}...](${post.post_url})\\n`;
    });
    report += `\\n`;
  }

  // Display emerging narratives
  if (emergingNarratives.length > 0) {
    report += `*📊 Emerging Narratives (Top ${emergingNarratives.length}):*\\n`;
    emergingNarratives.forEach((item, index) => {
      report += `  ${index + 1}. ${item.narrative.narrative_summary}\\n`;
      report += `     _Sentiment: ${item.narrative.sentiment}_`;
      if (item.probability && item.probability.probability_score > 0) {
        report += ` | _Probability: ${(item.probability.probability_score * 100).toFixed(2)}%_`;
      }
      report += `\\n`;
    });
  } else {
    report += `_No emerging narratives available at this time._\\n`;
  }

  return report;
}

export function formatPublicSummary(
  narrative: DailyNarrative,
  probability: NarrativeProbability
): string {
  let summary = `*📢 Crypto Narrative Update 📢*\\n\\n`;
  summary += `*Narrative:* ${narrative.narrative_summary}\\n`;
  summary += `*Sentiment:* ${narrative.sentiment}\\n`;
  summary += `*Probability:* ${(probability.probability_score * 100).toFixed(2)}%\\n`;
  summary += `\\n_Stay tuned for more detailed insights!_`;

  return summary;
}
