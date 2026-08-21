import { useEffect } from 'react';

export function useDocumentTitle(title: string, suffix = ' | BEU Connect Hub') {
  useEffect(() => {
    document.title = title + suffix;
  }, [title, suffix]);
}
