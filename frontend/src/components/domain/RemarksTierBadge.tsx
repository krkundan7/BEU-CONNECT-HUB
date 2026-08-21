import React from 'react';
import { evaluateRemarksTier } from '../../utils/remarksTier';

export const RemarksTierBadge: React.FC<{ points: number }> = ({ points }) => {
  const tier = evaluateRemarksTier(points);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${tier.badgeColor}`}>
      ★ {tier.tierName} ({points} pts)
    </span>
  );
};
