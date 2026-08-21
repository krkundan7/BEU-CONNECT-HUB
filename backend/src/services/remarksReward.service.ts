import { ContributionType, getRemarksForContribution } from '../utils/remarksCalculator';

export class RemarksRewardService {
  static evaluateRewardForAction(action: ContributionType, currentBalance: number) {
    const earned = getRemarksForContribution(action);
    const newBalance = currentBalance + earned;
    return {
      pointsAwarded: earned,
      newTotalBalance: newBalance,
      unlockedNewTier: newBalance >= 500 && currentBalance < 500,
    };
  }
}
