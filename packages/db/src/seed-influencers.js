"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const index_1 = require("../../config/src/index");
const dbPath = path_1.default.resolve(__dirname, '../../../', index_1.config.databasePath || './db/database.sqlite');
const db = new better_sqlite3_1.default(dbPath);
const influencers = [
    { profile_name: 'VitalikButerin', profile_url: 'https://twitter.com/VitalikButerin', primary_blockchain_network: 'Ethereum' },
    { profile_name: 'cz_binance', profile_url: 'https://twitter.com/cz_binance', primary_blockchain_network: 'BNB Chain' },
    { profile_name: 'elonmusk', profile_url: 'https://twitter.com/elonmusk', primary_blockchain_network: 'Dogecoin' },
    { profile_name: 'a16zcrypto', profile_url: 'https://twitter.com/a16zcrypto', primary_blockchain_network: 'Multi' },
    { profile_name: 'solana', profile_url: 'https://twitter.com/solana', primary_blockchain_network: 'Solana' },
    { profile_name: 'ethereum', profile_url: 'https://twitter.com/ethereum', primary_blockchain_network: 'Ethereum' },
    { profile_name: 'Cardano', profile_url: 'https://twitter.com/Cardano', primary_blockchain_network: 'Cardano' },
    { profile_name: 'Polkadot', profile_url: 'https://twitter.com/Polkadot', primary_blockchain_network: 'Polkadot' },
    { profile_name: 'binance', profile_url: 'https://twitter.com/binance', primary_blockchain_network: 'BNB Chain' },
    { profile_name: 'coinbase', profile_url: 'https://twitter.com/coinbase', primary_blockchain_network: 'Multi' },
];
function seedInfluencers() {
    console.log('Seeding influencers...');
    const insert = db.prepare('INSERT OR IGNORE INTO Influencers (profile_name, profile_url, primary_blockchain_network) VALUES (?, ?, ?)');
    let count = 0;
    for (const influencer of influencers) {
        const info = insert.run(influencer.profile_name, influencer.profile_url, influencer.primary_blockchain_network);
        if (info.changes > 0) {
            count++;
        }
    }
    console.log(`Seeding complete. ${count} new influencers added.`);
}
seedInfluencers();
db.close();
//# sourceMappingURL=seed-influencers.js.map