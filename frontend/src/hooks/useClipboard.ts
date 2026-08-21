import { useState, useCallback } from 'react';

export function useClipboard(timeoutMs = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), timeoutMs);
      return true;
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
      setHasCopied(false);
      return false;
    }
  }, [timeoutMs]);

  return { copy, hasCopied };
}
