"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
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
class PostRepository {
    addPost(post) {
        const insert = db.prepare('INSERT OR IGNORE INTO Posts (influencer_id, post_url, content, views, comments, interactions, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insert.run(post.influencer_id, post.post_url, post.content, post.views, post.comments, post.interactions, post.timestamp);
    }
    getNewPosts(since) {
        const stmt = db.prepare('SELECT * FROM Posts WHERE timestamp > ?');
        return stmt.all(since);
    }
    addPosts(posts) {
        const insertMany = db.transaction((postsArray) => {
            for (const post of postsArray) {
                this.addPost(post);
            }
        });
        insertMany(posts);
    }
    getPostsByIds(ids) {
        if (ids.length === 0) {
            return [];
        }
        const placeholders = ids.map(() => '?').join(',');
        const stmt = db.prepare(`SELECT * FROM Posts WHERE id IN (${placeholders})`);
        return stmt.all(...ids);
    }
}
exports.postRepository = new PostRepository();
//# sourceMappingURL=PostRepository.js.map