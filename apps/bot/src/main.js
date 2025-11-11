"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = require("@packages/config");
const src_1 = require("@packages/db/src/");
const telegramFormatter_1 = require("./services/telegramFormatter");
const node_cron_1 = __importDefault(require("node-cron"));
const bot = new telegraf_1.Telegraf(config_1.config.telegramBotToken);
// These are basic bot commands, but for a scheduled reporting bot, they might not be the primary focus.
// Keeping them for initial setup/testing if needed.
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
async function fetchLatestNarrativeData() {
    const latestData = src_1.narrativeRepository.getLatestNarrativeWithProbability();
    if (!latestData || !latestData.narrative || !latestData.probability) {
        console.log('No latest narrative data found.');
        return null;
    }
    let supportingPosts = [];
    if (latestData.probability.supporting_posts_ids) {
        const postIds = latestData.probability.supporting_posts_ids.split(',').map(Number);
        supportingPosts = src_1.postRepository.getPostsByIds(postIds);
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
            const privateReportMessage = (0, telegramFormatter_1.formatPrivateReport)(data.narrative, data.probability, data.supportingPosts);
            await bot.telegram.sendMessage(config_1.config.privateGroupId, privateReportMessage, { parse_mode: 'Markdown' });
            console.log('Private report sent.');
            // Send public summary
            const publicSummaryMessage = (0, telegramFormatter_1.formatPublicSummary)(data.narrative, data.probability);
            await bot.telegram.sendMessage(config_1.config.publicChannelId, publicSummaryMessage, { parse_mode: 'Markdown' });
            console.log('Public summary sent.');
        }
        else {
            console.log('No data to send in reports.');
        }
    }
    catch (error) {
        console.error('Error during report sending cycle:', error);
    }
    finally {
        // Stop the bot after the reporting cycle
        bot.stop('Reporting cycle finished');
        console.log(`[${new Date().toISOString()}] Report sending cycle finished.`);
    }
}
// Schedule the bot to send reports based on the interval in the .env file
node_cron_1.default.schedule(config_1.config.reportingInterval, sendReportsCycle);
console.log(`Bot service scheduled. Waiting for the first report run at interval: ${config_1.config.reportingInterval}`);
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
//# sourceMappingURL=main.js.map