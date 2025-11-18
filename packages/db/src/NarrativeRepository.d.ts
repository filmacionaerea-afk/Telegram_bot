import { DailyNarrative, NarrativeProbability } from '@packages/types';
declare class NarrativeRepository {
    saveDailyNarrative(date: string, narrative_summary: string, sentiment: string): number;
    getHistoricalNarratives(limit: number): DailyNarrative[];
    saveNarrativeProbability(narrative_id: number, probability_score: number, supporting_posts_ids: string): void;
    getLatestNarrativeWithProbability(): {
        narrative: DailyNarrative;
        probability: NarrativeProbability;
    } | null;
}
export declare const narrativeRepository: NarrativeRepository;
export {};
//# sourceMappingURL=NarrativeRepository.d.ts.map