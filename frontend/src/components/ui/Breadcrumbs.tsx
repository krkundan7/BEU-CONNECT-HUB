import React from 'react';

interface Crumb {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-600">/</span>}
          {item.active ? (
            <span className="text-emerald-400 font-medium">{item.label}</span>
          ) : (
            <button onClick={item.onClick} className="hover:text-slate-200 transition">
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
