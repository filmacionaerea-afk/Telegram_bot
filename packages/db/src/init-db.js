"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const config_1 = require("@packages/config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const schema_1 = require("./schema");
const dbPath = path_1.default.resolve(process.cwd(), config_1.config.databasePath);
const dbDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dbDir)) {
    fs_1.default.mkdirSync(dbDir, { recursive: true });
}
const db = new better_sqlite3_1.default(dbPath);
function initDb() {
    try {
        db.exec('DROP TABLE IF EXISTS NarrativeProbabilities;');
        db.exec('DROP TABLE IF EXISTS DailyNarratives;');
        db.exec('DROP TABLE IF EXISTS Posts;');
        db.exec('DROP TABLE IF EXISTS Influencers;');
        db.exec('DROP TABLE IF EXISTS AnalysisRuns;');
        db.exec(schema_1.schema);
        console.log('Database initialized successfully.');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}
initDb();
//# sourceMappingURL=init-db.js.map