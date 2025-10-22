import { Telegraf } from 'telegraf';
import config from '@packages/config';

const token = config.telegram.botToken;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment variables.');
}

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('Welcome!'));

bot.launch(() => {
  console.log('Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
