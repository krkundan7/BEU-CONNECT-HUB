import React from 'react';

export const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-amber-400 text-sm' : 'text-slate-700 text-sm'}>
          ★
        </span>
      ))}
    </div>
  );
};
