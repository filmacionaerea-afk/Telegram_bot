export interface Influencer {
  id: number;
  profile_name: string;
  profile_url: string;
  primary_blockchain_network: string;
}

export interface Post {
  id?: number;
  influencer_id: number;
  post_url: string;
  content: string;
  views: number;
  comments: number;
  interactions: number;
  timestamp: string; // ISO 8601 format
}

export interface DailyNarrative {
  id: number;
  date: string; // YYYY-MM-DD format
  narrative_summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface NarrativeProbability {
  id: number;
  narrative_id: number;
  probability_score: number; // 0.0 to 1.0
  calculation_date: string; // ISO 8601 format
  supporting_posts_ids: string; // Comma-separated list of Post IDs
}