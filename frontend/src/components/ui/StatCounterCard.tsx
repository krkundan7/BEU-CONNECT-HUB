import React from 'react';

interface StatProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}

export const StatCounterCard: React.FC<StatProps> = ({ label, value, subtext, icon }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtext && <p className="text-[11px] text-emerald-400 mt-0.5">{subtext}</p>}
      </div>
      {icon && <div className="p-3 rounded-xl bg-slate-800/80 text-emerald-400">{icon}</div>}
    </div>
  );
};
