import { noticeFilterSchema } from '../validators/noticeFilter.validator';

describe('Notice Filter Validator Schema', () => {
  it('validates allowed categories', () => {
    const result = noticeFilterSchema.safeParse({ category: 'EXAMINATION', semester: '5' });
    expect(result.success).toBe(true);
  });
});
