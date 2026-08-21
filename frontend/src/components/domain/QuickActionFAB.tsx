import React from 'react';

export const QuickActionFAB: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl hover:scale-105 transition"
      aria-label="Quick Action"
    >
      ⚡
    </button>
  );
};
