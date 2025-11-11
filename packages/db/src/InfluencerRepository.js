"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencerRepository = void 0;
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
class InfluencerRepository {
    getAllInfluencers() {
        return db.prepare('SELECT * FROM Influencers').all();
    }
}
exports.influencerRepository = new InfluencerRepository();
//# sourceMappingURL=InfluencerRepository.js.map