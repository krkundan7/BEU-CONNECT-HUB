import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const bgStyles = {
    success: 'bg-emerald-950 border-emerald-500/40 text-emerald-200',
    error: 'bg-rose-950 border-rose-500/40 text-rose-200',
    info: 'bg-indigo-950 border-indigo-500/40 text-indigo-200',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${bgStyles[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xs ml-2 font-bold">✕</button>
    </div>
  );
};
