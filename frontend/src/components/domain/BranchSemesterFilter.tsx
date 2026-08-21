import React from 'react';

interface FilterProps {
  selectedBranch: string;
  onSelectBranch: (b: string) => void;
  selectedSemester: number;
  onSelectSemester: (s: number) => void;
}

export const BranchSemesterFilter: React.FC<FilterProps> = ({
  selectedBranch,
  onSelectBranch,
  selectedSemester,
  onSelectSemester,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={selectedBranch}
        onChange={(e) => onSelectBranch(e.target.value)}
        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
      >
        <option value="CSE">Computer Science & Engg (CSE)</option>
        <option value="ECE">Electronics & Comm (ECE)</option>
        <option value="EEE">Electrical & Electronics (EEE)</option>
        <option value="CIVIL">Civil Engineering</option>
        <option value="MECH">Mechanical Engineering</option>
      </select>

      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <button
            key={sem}
            onClick={() => onSelectSemester(sem)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              selectedSemester === sem ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            S{sem}
          </button>
        ))}
      </div>
    </div>
  );
};
