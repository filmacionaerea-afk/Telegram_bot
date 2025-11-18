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
    timestamp: string;
}
export interface DailyNarrative {
    id: number;
    date: string;
    narrative_summary: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}
export interface NarrativeProbability {
    id: number;
    narrative_id: number;
    probability_score: number;
    calculation_date: string;
    supporting_posts_ids: string;
}
//# sourceMappingURL=index.d.ts.map