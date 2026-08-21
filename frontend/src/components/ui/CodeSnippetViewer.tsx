import React from 'react';
import { CopyButton } from './CopyButton';

export const CodeSnippetViewer: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto relative">
      <div className="absolute right-3 top-3">
        <CopyButton text={code} />
      </div>
      <div className="text-slate-500 mb-1">#{language}</div>
      <pre className="text-emerald-300">{code}</pre>
    </div>
  );
};
