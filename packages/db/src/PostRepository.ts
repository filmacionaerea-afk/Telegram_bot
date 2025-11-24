import Database from 'better-sqlite3';
import { config } from '@packages/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Post } from '@packages/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.resolve(process.cwd(), config.databasePath);

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

class PostRepository {
  public addPost(post: Post): void {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO Posts (influencer_id, post_url, content, views, comments, interactions, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    insert.run(post.influencer_id, post.post_url, post.content, post.views, post.comments, post.interactions, post.timestamp);
  }

  public getNewPosts(since: string): Post[] {
    const stmt = db.prepare('SELECT * FROM Posts WHERE timestamp > ?');
    return stmt.all(since) as Post[];
  }

  public addPosts(posts: Post[]): void {
    const insertMany = db.transaction((postsArray: Post[]) => {
      for (const post of postsArray) {
        this.addPost(post);
      }
    });
    insertMany(posts);
  }

  public getPostsByIds(ids: number[]): Post[] {
    if (ids.length === 0) {
      return [];
    }
    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT * FROM Posts WHERE id IN (${placeholders})`);
    return stmt.all(...ids) as Post[];
  }
}

export const postRepository = new PostRepository();