import React from 'react';

interface FilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
}

export const SearchFilterBar: React.FC<FilterBarProps> = ({ query, onQueryChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
      />
      {query && (
        <button onClick={() => onQueryChange('')} className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white">
          ✕
        </button>
      )}
    </div>
  );
};
