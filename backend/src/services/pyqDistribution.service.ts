export class PyqDistributionService {
  static computeTopicFrequency(questions: { topicId?: string }[]): Record<string, number> {
    const freqs: Record<string, number> = {};
    questions.forEach((q) => {
      if (q.topicId) freqs[q.topicId] = (freqs[q.topicId] || 0) + 1;
    });
    return freqs;
  }
}
