import React from 'react';

interface TimelineProps {
  title: string;
  subtitle: string;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineProps> = ({ title, subtitle, isLast = false }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        {!isLast && <div className="w-0.5 h-12 bg-slate-800 my-1" />}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};
