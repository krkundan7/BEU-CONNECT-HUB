import { useState, useEffect } from 'react';
import { getOfficialBEUCurriculum } from '../data/beuOfficialCurriculum';

export function useAcademicCurriculum(branch: string, semester: number) {
  const [curriculum, setCurriculum] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = getOfficialBEUCurriculum(branch, semester);
    setCurriculum(data);
    setLoading(false);
  }, [branch, semester]);

  return { curriculum, loading };
}
