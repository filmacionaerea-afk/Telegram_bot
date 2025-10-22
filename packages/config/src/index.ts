import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    privateGroupId: process.env.PRIVATE_GROUP_ID,
    publicChannelId: process.env.PUBLIC_CHANNEL_ID,
  },
  cron: {
    dataFetchInterval: process.env.DATA_FETCH_INTERVAL,
    analysisInterval: process.env.ANALYSIS_INTERVAL,
    reportingInterval: process.env.REPORTING_INTERVAL,
  },
  database: {
    path: process.env.DATABASE_PATH,
  },
  ai: {
    narrativeHistoryWindow: parseInt(process.env.NARRATIVE_HISTORY_WINDOW || '7', 10),
  },
};

export default config;
