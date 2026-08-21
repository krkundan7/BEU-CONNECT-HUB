import React, { useState, useEffect } from 'react';

export const CountUpAnimation: React.FC<{ end: number; durationMs?: number }> = ({ end, durationMs = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (durationMs / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end, durationMs]);

  return <span>{count}</span>;
};
