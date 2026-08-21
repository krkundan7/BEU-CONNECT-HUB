import { RemarksRewardService } from '../services/remarksReward.service';

describe('Remarks Reward Service', () => {
  it('awards 25 points for note upload', () => {
    const res = RemarksRewardService.evaluateRewardForAction('NOTE_UPLOAD', 100);
    expect(res.pointsAwarded).toBe(25);
    expect(res.newTotalBalance).toBe(125);
  });
});
