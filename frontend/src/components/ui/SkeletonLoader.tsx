import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`} />;
};
