import { Post } from '@packages/types';
declare class PostRepository {
    addPost(post: Post): void;
    getNewPosts(since: string): Post[];
    addPosts(posts: Post[]): void;
    getPostsByIds(ids: number[]): Post[];
}
export declare const postRepository: PostRepository;
export {};
