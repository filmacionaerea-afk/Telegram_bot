"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisRunRepository = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const config_1 = require("@packages/config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbPath = path_1.default.resolve(process.cwd(), config_1.config.databasePath);
const dbDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dbDir)) {
    fs_1.default.mkdirSync(dbDir, { recursive: true });
}
const db = new better_sqlite3_1.default(dbPath);
const TABLE_NAME = 'AnalysisRuns';
function getLastAnalysisRun() {
    const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_timestamp TEXT NOT NULL
    );
  `);
    stmt.run();
    const row = db.prepare(`SELECT run_timestamp FROM ${TABLE_NAME} ORDER BY id DESC LIMIT 1`).get();
    return row ? row.run_timestamp : new Date(0).toISOString();
}
function addAnalysisRun(timestamp) {
    const stmt = db.prepare(`INSERT INTO ${TABLE_NAME} (run_timestamp) VALUES (?)`);
    stmt.run(timestamp);
}
exports.analysisRunRepository = {
    getLastAnalysisRun,
    addAnalysisRun,
};
//# sourceMappingURL=AnalysisRunRepository.js.map