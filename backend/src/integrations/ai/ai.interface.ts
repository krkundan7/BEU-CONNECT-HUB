export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachment?: {
    type: 'image' | 'pdf';
    dataUrl: string;
    name?: string;
    size?: string;
  };
}

export type TopicPriority = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface BEUTopicRankItem {
  rank: number;
  unit: number;
  topic: string;
  pyqFrequency: string; // e.g. "6/6 (100%)" or "5 times"
  yearsAppeared: number[];
  typicalMarks: string; // e.g. "14 Marks" or "7 Marks"
  importanceScore: number; // 0 - 100
  priority: TopicPriority;
  reason: string;
}

export interface BEUMostRepeatedQuestion {
  id: string;
  question: string;
  type: 'Exact Repeated' | 'Conceptually Modified';
  unit: number;
  timesRepeated: number;
  yearsAsked: number[];
  typicalMarks: string;
  wordingChangesNote: string;
  probabilityAssessment: 'Very High Probability' | 'High Probability' | 'Moderate Probability' | 'Low Probability';
}

export interface BEUNumericalProblem {
  unit: number;
  topic: string;
  frequency: string;
  typicalMarks: string;
  standardProblemModel: string;
  keyFormulae: string[];
}

export interface BEUDerivationProblem {
  unit: number;
  derivationName: string;
  yearsAsked: number[];
  typicalMarks: string;
  keyStepsSummary: string;
}

export interface BEUTheoryQuestion {
  unit: number;
  topic: string;
  yearsAsked: number[];
  typicalMarks: string;
  mustIncludeDiagramsOrPoints: string[];
}

export interface BEUUnitAnalysis {
  unitNumber: number;
  unitTitle: string;
  overallImportance: string; // e.g. "Highest Yield Unit"
  unitRank: number; // 1 to 5
  pyqWeightagePercentage: number;
  mostImportantTopics: string[];
  mostRepeatedQuestions: string[];
  numericalTopics: string[];
  derivationTopics: string[];
  theoryTopics: string[];
  lowPriorityTopics: string[];
}

export interface BEUPrepStrategies {
  sevenDayStrategy: {
    dayRange: string;
    focusUnits: string;
    topicsToCover: string[];
    actionItems: string;
  }[];
  threeDayStrategy: {
    day: string;
    focusArea: string;
    topicsToCover: string[];
    timeAllocation: string;
  }[];
  oneDayRevisionStrategy: {
    timeSlot: string;
    unitOrTopic: string;
    keyChecklist: string[];
  }[];
  finalTopTopicsToStudyFirst: string[];
}

export interface BEUSyllabusUnitMapping {
  unit: number;
  unitTitle: string;
  chapters: {
    chapterName: string;
    topics: {
      topicName: string;
      subtopics: string[];
      mappedPYQCount: number;
      isCore: boolean;
    }[];
  }[];
}

export interface BEUQuestionPatternMeta {
  totalExamMarks: number; // 70
  totalQuestions: number; // 9
  compulsoryQuestion: string; // "Question 1 is compulsory (Short Answer/MCQ, 14 marks)"
  choiceStructure: string; // "Answer any 4 questions out of remaining 8 (14 marks each)"
  theoryNumericalRatio: string; // e.g. "65% Theory / Derivation, 35% Numerical"
  marksPerQuestion: string; // "14 marks (often split as 7+7 or full 14)"
  recentTrends: string[];
}

export interface BEUFullPatternAnalysisReport {
  branch: string;
  semester: number;
  subjectName: string;
  subjectCode: string;
  totalPapersAnalyzed: number;
  yearsCovered: number[];
  summary: {
    overview: string;
    keyTakeaway: string;
    scoringTargetAnalysis: string;
  };
  syllabusMapping: BEUSyllabusUnitMapping[];
  questionPattern: BEUQuestionPatternMeta;
  unitWiseAnalysis: BEUUnitAnalysis[];
  topRankedTopics: BEUTopicRankItem[]; // Top 20
  mostRepeatedQuestions: BEUMostRepeatedQuestion[];
  importantNumericals: BEUNumericalProblem[];
  importantDerivations: BEUDerivationProblem[];
  importantTheoryQuestions: BEUTheoryQuestion[];
  priorityBreakdown: {
    veryHighPriority: string[];
    highPriority: string[];
    mediumPriority: string[];
    lowPriority: string[];
  };
  preparationStrategy: BEUPrepStrategies;
  warningAndDisclaimers: string[];
  formattedMarkdownReport: string;
}

// Backward compatibility interfaces
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
  analyzePYQPatterns(
    subjectName: string,
    branch?: string,
    semester?: number,
    papersMetadata?: any[]
  ): Promise<BEUFullPatternAnalysisReport>;
}
