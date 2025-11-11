"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.narrativeRepository = void 0;
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
class NarrativeRepository {
    saveDailyNarrative(date, narrative_summary, sentiment) {
        const stmt = db.prepare('INSERT INTO DailyNarratives (date, narrative_summary, sentiment) VALUES (?, ?, ?);');
        const result = stmt.run(date, narrative_summary, sentiment);
        return result.lastInsertRowid;
    }
    getHistoricalNarratives(limit) {
        const stmt = db.prepare('SELECT id, date, narrative_summary, sentiment FROM DailyNarratives ORDER BY date DESC LIMIT ?');
        return stmt.all(limit);
    }
    saveNarrativeProbability(narrative_id, probability_score, supporting_posts_ids) {
        const calculation_date = new Date().toISOString();
        const stmt = db.prepare('INSERT INTO NarrativeProbabilities (narrative_id, probability_score, calculation_date, supporting_posts_ids) VALUES (?, ?, ?, ?);');
        stmt.run(narrative_id, probability_score, calculation_date, supporting_posts_ids);
    }
    getLatestNarrativeWithProbability() {
        const latestNarrative = db.prepare('SELECT * FROM DailyNarratives ORDER BY date DESC LIMIT 1').get();
        if (!latestNarrative) {
            return null;
        }
        const probability = db.prepare('SELECT * FROM NarrativeProbabilities WHERE narrative_id = ? ORDER BY calculation_date DESC LIMIT 1').get(latestNarrative.id);
        if (!probability) {
            return { narrative: latestNarrative, probability: null }; // Return with null probability if not found
        }
        return { narrative: latestNarrative, probability };
    }
}
exports.narrativeRepository = new NarrativeRepository();
//# sourceMappingURL=NarrativeRepository.js.map