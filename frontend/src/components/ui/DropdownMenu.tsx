import React, { useState } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

export const DropdownMenu: React.FC<{ triggerLabel: string; items: DropdownItem[] }> = ({ triggerLabel, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700">
        {triggerLabel} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
