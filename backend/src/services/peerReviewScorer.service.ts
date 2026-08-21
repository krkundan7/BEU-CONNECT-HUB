export class PeerReviewScorerService {
  static calculateWeightedRating(ratings: number[]): number {
    if (!ratings.length) return 5.0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return Number((sum / ratings.length).toFixed(1));
  }
}
