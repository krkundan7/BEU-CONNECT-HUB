export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface PYQAnalysisItem {
  topic: string;
  unit: number;
  frequency: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  marksWeightage: string;
  recurringThemes: string[];
}

export interface PYQAnalysisResult {
  subject: string;
  topics: PYQAnalysisItem[];
  highYieldTips: string[];
  disclaimer: string;
}

export interface IAIService {
  generateAcademicResponse(messages: AIChatMessage[]): Promise<string>;
  analyzePYQPatterns(subjectName: string, papersMetadata: any[]): Promise<PYQAnalysisResult>;
}
