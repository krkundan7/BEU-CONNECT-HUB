export interface IGoalMapTrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetRoles: string[];
  averagePackageLPA: string;
  requiredSkills: string[];
  recommendedElectives: string[];
  roadmapUnits: { title: string; durationWeeks: number; tasks: string[] }[];
}
