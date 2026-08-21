export function formatSemesterRoman(sem: number): string {
  const romans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  return romans[sem] || String(sem);
}

export function formatSubjectCode(code: string): string {
  return code.toUpperCase().trim();
}
