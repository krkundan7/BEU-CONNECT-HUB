import React, { useState } from 'react';

export const TagInput: React.FC<{ tags: string[]; onTagsChange: (tags: string[]) => void }> = ({ tags, onTagsChange }) => {
  const [val, setVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && val.trim()) {
      e.preventDefault();
      if (!tags.includes(val.trim())) onTagsChange([...tags, val.trim()]);
      setVal('');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 flex items-center gap-1">
          {tag}
          <button onClick={() => onTagsChange(tags.filter((t) => t !== tag))} className="text-slate-500 hover:text-white">✕</button>
        </span>
      ))}
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag..."
        className="bg-transparent text-xs text-slate-200 outline-none flex-1 min-w-[80px]"
      />
    </div>
  );
};
