import { DateHelper } from '../utils/dateHelper';

describe('DateHelper', () => {
  it('formats academic year correctly', () => {
    expect(DateHelper.formatAcademicYear(2025)).toBe('2025-26');
  });

  it('correctly identifies odd and even semesters', () => {
    expect(DateHelper.isSemesterOdd(3)).toBe(true);
    expect(DateHelper.isSemesterOdd(4)).toBe(false);
  });
});
