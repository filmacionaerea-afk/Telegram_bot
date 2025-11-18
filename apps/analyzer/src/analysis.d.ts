export declare function getNarrativeAndSentiment(posts: any[]): Promise<{
    narrative: string;
    sentiment: string;
}>;
export declare function getProbabilityAndEmergingNarratives(newNarrative: string, historicalNarratives: {
    summary: string;
    sentiment: string;
}[]): Promise<{
    probability_score: number;
    emerging_narratives: {
        summary: string;
        sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    }[];
}>;
//# sourceMappingURL=analysis.d.ts.map