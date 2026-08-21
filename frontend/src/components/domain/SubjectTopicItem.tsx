import React from 'react';

interface TopicProps {
  topicTitle: string;
  hours: number;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export const SubjectTopicItem: React.FC<TopicProps> = ({ topicTitle, hours, isCompleted = false, onToggleComplete }) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/40 transition">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggleComplete}
          className="h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
        />
        <span className={`text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
          {topicTitle}
        </span>
      </div>
      <span className="text-[10px] text-slate-500">{hours} hrs</span>
    </div>
  );
};
