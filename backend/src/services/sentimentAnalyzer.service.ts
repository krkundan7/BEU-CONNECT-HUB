export class SentimentAnalyzerService {
  static evaluateFeedback(text: string): 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' {
    const positiveWords = ['great', 'excellent', 'helpful', 'awesome', 'best', 'good'];
    const negativeWords = ['bad', 'broken', 'error', 'worst', 'missing', 'poor'];

    const lower = text.toLowerCase();
    const posMatches = positiveWords.filter((w) => lower.includes(w)).length;
    const negMatches = negativeWords.filter((w) => lower.includes(w)).length;

    if (posMatches > negMatches) return 'POSITIVE';
    if (negMatches > posMatches) return 'NEGATIVE';
    return 'NEUTRAL';
  }
}
