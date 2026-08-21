export interface ICurriculumTopic {
  id: string;
  title: string;
  estimatedHours: number;
  importanceRating: 'HIGH' | 'MEDIUM' | 'LOW';
  pyqFrequency: number;
  isCompleted?: boolean;
}

export interface ICurriculumUnit {
  id: string;
  unitNumber: number;
  unitTitle: string;
  totalHours: number;
  topics: ICurriculumTopic[];
}
