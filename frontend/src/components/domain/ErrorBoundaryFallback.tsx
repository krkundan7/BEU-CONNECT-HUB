import React from 'react';

export const ErrorBoundaryFallback: React.FC<{ error?: Error; onReset?: () => void }> = ({ error, onReset }) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl mb-4">⚠</div>
      <h3 className="text-lg font-bold text-white">Something went wrong</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{error?.message || 'An unexpected client error occurred.'}</p>
      {onReset && (
        <button onClick={onReset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl">
          Try Again
        </button>
      )}
    </div>
  );
};
