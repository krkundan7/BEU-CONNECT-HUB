import { calculateSGPA, calculateCGPA, cgpaToPercentage } from '../utils/gradeCalculator';

describe('Grade Calculator', () => {
  it('calculates SGPA accurately', () => {
    const subjects = [
      { credit: 4, gradePoint: 9 },
      { credit: 3, gradePoint: 8 },
    ];
    // (36 + 24) / 7 = 60 / 7 = 8.57
    expect(calculateSGPA(subjects)).toBe(8.57);
  });

  it('calculates CGPA correctly', () => {
    const sems = [
      { sgpa: 8.5, totalCredits: 20 },
      { sgpa: 9.0, totalCredits: 20 },
    ];
    expect(calculateCGPA(sems)).toBe(8.75);
  });

  it('converts CGPA to percentage using BEU formula', () => {
    expect(cgpaToPercentage(8.75)).toBe(80.0);
  });
});
