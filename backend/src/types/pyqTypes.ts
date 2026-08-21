export interface IPYQQuestionItem {
  id: string;
  questionText: string;
  unitNumber: number;
  marks: number;
  year: number;
  isRepeated: boolean;
  frequencyScore: number;
}

export interface IPYQPaperMetadata {
  id: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  examYear: number;
  fileUrl: string;
  solutionUrl?: string;
}
