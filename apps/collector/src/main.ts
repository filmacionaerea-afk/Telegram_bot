console.log('Before config import');
import config from '@packages/config';
console.log('After config import, before db import');
import db from '@packages/db';
import db, { postRepository } from '@packages/db'; // Import postRepository
console.log('After db import, before types import');
import { Influencer, Post } from '@packages/types'; // Import interfaces
console.log('After types import');

console.log('Collector service started.');
console.log('Database path:', config.database.path);

// Simulate an internal data API call
async function fetchPostsFromDataAPI(influencer: Influencer): Promise<Post[]> {
  console.log(`Simulating fetching posts for ${influencer.profile_name}...`);
  const mockPosts: Post[] = [
    {
      id: Date.now() + 1,
      influencer_id: influencer.id,
      post_url: `https://twitter.com/${influencer.profile_name}/status/${Date.now() + 1}`,
      content: `Mock post 1 from ${influencer.profile_name} about crypto.`,
      views: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      interactions: Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
    },
    {
      id: Date.now() + 2,
      influencer_id: influencer.id,
      post_url: `https://twitter.com/${influencer.profile_name}/status/${Date.now() + 2}`,
      content: `Mock post 2 from ${influencer.profile_name} discussing blockchain.`,
      views: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      interactions: Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
    },
  ];
  return new Promise(resolve => setTimeout(() => resolve(mockPosts), 1000));
}

async function fetchPostsForInfluencer(influencerId: number): Promise<Post[]> {
  console.log('Before db.prepare in fetchPostsForInfluencer');
  const getInfluencer = db.prepare('SELECT * FROM Influencers WHERE id = ?');
  console.log('After db.prepare in fetchPostsForInfluencer');
  const influencer: Influencer | undefined = getInfluencer.get(influencerId) as Influencer;

  if (!influencer) {
    console.warn(`Influencer with ID ${influencerId} not found.`);
    return [];
  }

  try {
    const posts = await fetchPostsFromDataAPI(influencer);
    console.log(`Fetched ${posts.length} posts for ${influencer.profile_name}.`);
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for ${influencer.profile_name}:`, error);
    return [];
  }
}

async function startCollector() {
  console.log('Collector is running, waiting for cron job to trigger...');

  // Example usage: Fetch posts for influencer with ID 1
  const exampleInfluencerId = 1;
  const posts = await fetchPostsForInfluencer(exampleInfluencerId);
  console.log('Example fetched posts:', posts);

  // Save fetched posts to the database
  if (posts.length > 0) {
    postRepository.addPosts(posts);
    console.log(`Saved ${posts.length} posts to the database.`);
  }
}

startCollector().catch(error => {
  console.error('Collector service failed to start:', error);
  process.exit(1);
});