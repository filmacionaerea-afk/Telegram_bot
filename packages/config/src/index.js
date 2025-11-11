"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../../.env'),
});
exports.config = {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    privateGroupId: process.env.PRIVATE_GROUP_ID,
    publicChannelId: process.env.PUBLIC_CHANNEL_ID,
    dataFetchInterval: process.env.DATA_FETCH_INTERVAL,
    analysisInterval: process.env.ANALYSIS_INTERVAL,
    reportingInterval: process.env.REPORTING_INTERVAL,
    databasePath: process.env.DATABASE_PATH,
    narrativeHistoryWindow: parseInt(process.env.NARRATIVE_HISTORY_WINDOW || '7', 10),
    perplexityApiKey: process.env.PERPLEXITY_API_KEY,
};
// Validate essential configuration
for (const key of ['telegramBotToken', 'privateGroupId', 'publicChannelId', 'databasePath', 'perplexityApiKey']) {
    if (!exports.config[key]) {
        console.error(`Error: Missing critical configuration for ${key}`);
        process.exit(1);
    }
}
//# sourceMappingURL=index.js.map