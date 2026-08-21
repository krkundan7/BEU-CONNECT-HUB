import React from 'react';

interface AvatarGroupProps {
  names: string[];
  maxDisplay?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ names, maxDisplay = 4 }) => {
  const visible = names.slice(0, maxDisplay);
  const overflow = names.length - maxDisplay;

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {visible.map((name, i) => (
        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
          {name.charAt(0)}
        </div>
      ))}
      {overflow > 0 && (
        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-300">
          +{overflow}
        </div>
      )}
    </div>
  );
};
