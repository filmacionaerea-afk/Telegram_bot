import { Telegraf } from 'telegraf';
import { config } from '@packages/config';
import { narrativeRepository, postRepository } from '@packages/db/src/';
import { DailyNarrative, NarrativeProbability, Post } from '@packages/types';
import { formatPrivateReport, formatPublicSummary } from './services/telegramFormatter';
import cron from 'node-cron';

const bot = new Telegraf(config.telegramBotToken);

// These are basic bot commands, but for a scheduled reporting bot, they might not be the primary focus.
// Keeping them for initial setup/testing if needed.
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

async function fetchLatestNarrativeData(): Promise<{
  narrative: DailyNarrative;
  probability: NarrativeProbability;
  supportingPosts: Post[];
} | null> {
  const latestData = narrativeRepository.getLatestNarrativeWithProbability();

  if (!latestData || !latestData.narrative || !latestData.probability) {
    console.log('No latest narrative data found.');
    return null;
  }

  let supportingPosts: Post[] = [];
  if (latestData.probability.supporting_posts_ids) {
    const postIds = latestData.probability.supporting_posts_ids.split(',').map(Number);
    supportingPosts = postRepository.getPostsByIds(postIds);
  }

  return {
    narrative: latestData.narrative,
    probability: latestData.probability,
    supportingPosts: supportingPosts,
  };
}

async function sendReportsCycle() {
  console.log(`[${new Date().toISOString()}] Starting new report sending cycle...`);
  try {
    // Launch the bot for the duration of the reporting cycle
    await bot.launch();

    const data = await fetchLatestNarrativeData();
    if (data) {
      console.log('Fetched latest narrative data:', data.narrative.narrative_summary);
      console.log('Probability:', data.probability.probability_score);
      console.log('Supporting Posts:', data.supportingPosts.length);

      // Send private report
      const privateReportMessage = formatPrivateReport(data.narrative, data.probability, data.supportingPosts);
      await bot.telegram.sendMessage(config.privateGroupId, privateReportMessage, { parse_mode: 'Markdown' });
      console.log('Private report sent.');

      // Send public summary
      const publicSummaryMessage = formatPublicSummary(data.narrative, data.probability);
      await bot.telegram.sendMessage(config.publicChannelId, publicSummaryMessage, { parse_mode: 'Markdown' });
      console.log('Public summary sent.');
    } else {
      console.log('No data to send in reports.');
    }
  } catch (error) {
    console.error('Error during report sending cycle:', error);
  } finally {
    // Stop the bot after the reporting cycle
    bot.stop('Reporting cycle finished');
    console.log(`[${new Date().toISOString()}] Report sending cycle finished.`);
  }
}

// Schedule the bot to send reports based on the interval in the .env file
cron.schedule(config.reportingInterval, sendReportsCycle);

console.log(`Bot service scheduled. Waiting for the first report run at interval: ${config.reportingInterval}`);

// Enable graceful stop for the cron scheduler itself
process.once('SIGINT', () => {
  console.log('SIGINT received, stopping cron scheduler.');
  // No direct cron.stop() method, but process exit will stop it.
  process.exit(0);
});
process.once('SIGTERM', () => {
  console.log('SIGTERM received, stopping cron scheduler.');
  process.exit(0);
});
