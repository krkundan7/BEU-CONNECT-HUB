import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onSelectTab }) => {
  return (
    <div className="flex border-b border-slate-800 space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`pb-3 text-sm font-medium transition relative ${
            activeTab === tab.id ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
