export interface IRemarksTier {
  tierName: string;
  badgeColor: string;
  minPoints: number;
}

export function evaluateRemarksTier(points: number): IRemarksTier {
  if (points >= 1500) return { tierName: 'Platinum Fellow', badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30', minPoints: 1500 };
  if (points >= 500) return { tierName: 'Gold Mentor', badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30', minPoints: 500 };
  if (points >= 150) return { tierName: 'Silver Scholar', badgeColor: 'text-slate-300 bg-slate-800/60 border-slate-600/30', minPoints: 150 };
  return { tierName: 'Bronze Pioneer', badgeColor: 'text-orange-400 bg-orange-950/60 border-orange-500/30', minPoints: 0 };
}
