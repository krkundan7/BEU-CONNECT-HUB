export function cgpaToHonorsClass(cgpa: number): string {
  if (cgpa >= 8.5) return 'First Class with Distinction';
  if (cgpa >= 6.75) return 'First Class';
  if (cgpa >= 5.0) return 'Second Class';
  return 'Pass Class';
}

export function cgpaToEquivalentPercentage(cgpa: number): number {
  return Number(((cgpa - 0.75) * 10).toFixed(1));
}
