import db from './index.js';
import { Post } from '../../types/src/index.js';

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
}

export const postRepository = new PostRepository();