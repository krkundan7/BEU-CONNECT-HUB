import { slugify, sanitizeFileName } from '../utils/slugifier';

describe('Slugifier Utilities', () => {
  it('should slugify strings properly', () => {
    expect(slugify('Database Management Systems 2026')).toBe('database-management-systems-2026');
  });

  it('should sanitize dangerous file names', () => {
    expect(sanitizeFileName('../../secret.pdf')).toBe('.._.._secret.pdf');
  });
});
