/**
 * Remarks points calculator based on contribution weights
 */
export type ContributionType = 'NOTE_UPLOAD' | 'PYQ_UPLOAD' | 'ANSWER_DOUBT' | 'MENTOR_SESSION' | 'BUG_REPORT';

const REWARD_WEIGHTS: Record<ContributionType, number> = {
  NOTE_UPLOAD: 25,
  PYQ_UPLOAD: 35,
  ANSWER_DOUBT: 10,
  MENTOR_SESSION: 50,
  BUG_REPORT: 20,
};

export function getRemarksForContribution(type: ContributionType): number {
  return REWARD_WEIGHTS[type] || 5;
}
