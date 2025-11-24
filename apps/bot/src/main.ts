import { Telegraf } from 'telegraf';
import { config } from '@packages/config';
import { narrativeRepository, postRepository } from '@packages/db';
import type { DailyNarrative, NarrativeProbability, Post } from '@packages/types';
import { formatPrivateReport, formatPublicSummary } from './services/telegramFormatter.js';
import cron from 'node-cron';

try {
  console.log('--- DEBUG: Loading Config ---');
  console.log('Telegram Bot Token:', config.telegramBotToken ? 'Loaded' : 'MISSING!');
  console.log('Private Group ID:', config.privateGroupId ? 'Loaded' : 'MISSING!');
  console.log('Public Channel ID:', config.publicChannelId ? 'Loaded' : 'MISSING!');
  console.log('--- END DEBUG ---');

  if (!config.telegramBotToken) {
    throw new Error('FATAL: Telegram Bot Token is missing. Check your .env file.');
  }

  const bot = new Telegraf(config.telegramBotToken);

  // Basic bot commands
  bot.start((ctx) => ctx.reply('¡Bienvenido al Bot de Narrativas Crypto! 🚀\n\nComandos disponibles:\n/reporte - Obtener reporte completo\n/resumen - Obtener resumen público\n/latest - Última narrativa\n/help - Ver ayuda'));

  bot.help((ctx) => ctx.reply('Comandos disponibles:\n\n/reporte - Reporte detallado con narrativa, probabilidad y posts de soporte\n/resumen - Resumen público de la narrativa\n/latest - Última narrativa detectada\n/start - Ver mensaje de bienvenida'));

  // Command to get full detailed report
  bot.command(['reporte', 'report'], async (ctx) => {
    try {
      const data = await fetchLatestNarrativeData();
      if (data) {
        const privateReportMessage = formatPrivateReport(data.narrative, data.probability, data.supportingPosts);
        await ctx.reply(privateReportMessage, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('No hay datos de narrativa disponibles en este momento.');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      await ctx.reply('Error al obtener el reporte. Por favor intenta más tarde.');
    }
  });

  // Command to get public summary
  bot.command(['resumen', 'summary'], async (ctx) => {
    try {
      const data = await fetchLatestNarrativeData();
      if (data) {
        const publicSummaryMessage = formatPublicSummary(data.narrative, data.probability);
        await ctx.reply(publicSummaryMessage, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('No hay datos de narrativa disponibles en este momento.');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      await ctx.reply('Error al obtener el resumen. Por favor intenta más tarde.');
    }
  });

  // Command to get just the latest narrative
  bot.command('latest', async (ctx) => {
    try {
      const data = await fetchLatestNarrativeData();
      if (data) {
        await ctx.reply(`*Última Narrativa Detectada:*\n\n${data.narrative.narrative_summary}\n\n*Sentimiento:* ${data.narrative.sentiment}\n*Probabilidad:* ${(data.probability.probability_score * 100).toFixed(2)}%`, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('No hay datos de narrativa disponibles en este momento.');
      }
    } catch (error) {
      console.error('Error fetching latest narrative:', error);
      await ctx.reply('Error al obtener la narrativa. Por favor intenta más tarde.');
    }
  });

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
    }
    console.log(`[${new Date().toISOString()}] Report sending cycle finished.`);
  }

  // Launch the bot to listen for commands
  bot.launch();
  console.log('Bot launched and listening for commands...');

  // Schedule the bot to send reports based on the interval in the .env file
  cron.schedule(config.reportingInterval, sendReportsCycle);

  console.log(`Bot service scheduled. Waiting for the first report run at interval: ${config.reportingInterval}`);

  // Enable graceful stop
  process.once('SIGINT', () => {
    console.log('SIGINT received, stopping bot...');
    bot.stop('SIGINT');
    process.exit(0);
  });
  process.once('SIGTERM', () => {
    console.log('SIGTERM received, stopping bot...');
    bot.stop('SIGTERM');
    process.exit(0);
  });

} catch (e) {
  console.error('A critical error occurred during bot initialization:', e);
  process.exit(1);
}
