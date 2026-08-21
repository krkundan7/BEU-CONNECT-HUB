import { useState, useCallback } from 'react';

export function useToggle(initialValue = false): [boolean, () => void, (val: boolean) => void] {
  const [state, setState] = useState(initialValue);
  const toggle = useCallback(() => setState((v) => !v), []);
  return [state, toggle, setState];
}
