import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

export const config = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN as string,
  privateGroupId: process.env.PRIVATE_GROUP_ID as string,
  publicChannelId: process.env.PUBLIC_CHANNEL_ID as string,
  dataFetchInterval: process.env.DATA_FETCH_INTERVAL as string,
  analysisInterval: process.env.ANALYSIS_INTERVAL as string,
  reportingInterval: process.env.REPORTING_INTERVAL as string,
  databasePath: process.env.DATABASE_PATH as string,
  narrativeHistoryWindow: parseInt(process.env.NARRATIVE_HISTORY_WINDOW || '7', 10),
};

// Validate essential configuration
for (const key of ['telegramBotToken', 'privateGroupId', 'publicChannelId', 'databasePath']) {
  if (!config[key as keyof typeof config]) {
    console.error(`Error: Missing critical configuration for ${key}`);
    process.exit(1);
  }
}
