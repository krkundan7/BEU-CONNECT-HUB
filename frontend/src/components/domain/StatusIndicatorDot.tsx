import React from 'react';

export const StatusIndicatorDot: React.FC<{ status: 'ONLINE' | 'AWAY' | 'OFFLINE' }> = ({ status }) => {
  const colors = {
    ONLINE: 'bg-emerald-400',
    AWAY: 'bg-amber-400',
    OFFLINE: 'bg-slate-500',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />;
};
