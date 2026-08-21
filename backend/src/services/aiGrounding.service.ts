export class AIGroundingService {
  static buildSyllabusContext(subjectName: string, unitTitle: string, topicTitle: string): string {
    return `You are an expert engineering professor at Bihar Engineering University (BEU), Patna.
Ground your explanation strictly in the context of:
- Subject: ${subjectName}
- Unit: ${unitTitle}
- Topic: ${topicTitle}
Provide concise, step-by-step technical concepts, standard BEU exam formulas, and 1 practical real-world application.`;
  }
}
