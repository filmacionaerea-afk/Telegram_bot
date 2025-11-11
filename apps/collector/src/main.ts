import { config } from '@packages/config';
import { postRepository, influencerRepository } from '@packages/db';
import { Influencer, Post } from '@packages/types';
import { perplexityClient } from './services/perplexity';
import cron from 'node-cron';

console.log('Collector service started.');
console.log('Database path:', config.databasePath);

// Maps the assumed Perplexity API response to our internal Post format
function mapPerplexityResponseToPosts(perplexityData: any, influencer: Influencer): Post[] {
  if (!perplexityData || !Array.isArray(perplexityData.results)) {
    console.warn('Perplexity API response is not in the expected format or has no results.');
    return [];
  }

  return perplexityData.results.map((item: any, index: number) => {
    // Basic validation for essential fields
    if (!item.url || !item.text) {
      console.warn('Skipping an item from Perplexity due to missing URL or text.');
      return null;
    }

    return {
      id: Date.now() + index, // Temporary ID generation
      influencer_id: influencer.id,
      post_url: item.url,
      content: item.text,
      // Safely access metadata, providing default values
      views: item.metadata?.views ?? 0,
      comments: item.metadata?.replies ?? 0,
      interactions: item.metadata?.likes ?? 0,
      timestamp: new Date().toISOString(), // Perplexity API doesn't provide this, so we use current time
    };
  }).filter((post: Post | null): post is Post => post !== null); // Filter out any null entries
}

async function fetchPostsForInfluencer(influencer: Influencer): Promise<Post[]> {
  console.log(`Fetching posts for ${influencer.profile_name}...`);

  try {
    const perplexityResponse = await perplexityClient.getLatestPosts(influencer.profile_name);
    const posts = mapPerplexityResponseToPosts(perplexityResponse, influencer);
    console.log(`Mapped ${posts.length} posts for ${influencer.profile_name}.`);
    return posts;
  } catch (error) {
    console.error(`Error fetching or mapping posts for ${influencer.profile_name}:`, error);
    return [];
  }
}

async function runCollectionCycle() {
  console.log(`[${new Date().toISOString()}] Starting new collection cycle...`);

  const influencers: Influencer[] = influencerRepository.getAllInfluencers();
  console.log(`Found ${influencers.length} influencers to process.`);

  for (const influencer of influencers) {
    const posts = await fetchPostsForInfluencer(influencer);
    if (posts.length > 0) {
      postRepository.addPosts(posts);
      console.log(`Saved ${posts.length} new posts for ${influencer.profile_name} to the database.`);
    }
  }

  console.log(`[${new Date().toISOString()}] Collection cycle finished.`);
}

// Schedule the collector to run based on the interval in the .env file
cron.schedule(config.dataFetchInterval, runCollectionCycle);

console.log(`Collector service scheduled. Waiting for the first run at interval: ${config.dataFetchInterval}`);