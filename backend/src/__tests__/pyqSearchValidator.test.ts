import { pyqSearchSchema } from '../validators/pyqSearch.validator';

describe('PYQ Search Validator Schema', () => {
  it('coerces and validates year parameter', () => {
    const result = pyqSearchSchema.safeParse({ year: '2024', semester: '6' });
    expect(result.success).toBe(true);
  });
});
