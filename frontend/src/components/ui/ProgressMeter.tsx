import React from 'react';

interface ProgressMeterProps {
  percent: number;
  label?: string;
  showPercentLabel?: boolean;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({ percent, label, showPercentLabel = true }) => {
  const bounded = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      {(label || showPercentLabel) && (
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentLabel && <span className="font-semibold text-emerald-400">{bounded}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${bounded}%` }}
        />
      </div>
    </div>
  );
};
