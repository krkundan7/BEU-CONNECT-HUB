import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200 hover:bg-slate-800/40 transition"
      >
        <span>{title}</span>
        <span className="text-slate-400 text-sm">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="p-4 border-t border-slate-800/60 text-slate-300 text-sm">{children}</div>}
    </div>
  );
};
