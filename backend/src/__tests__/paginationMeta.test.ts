import { buildPaginationResult } from '../utils/paginationMeta';

describe('Pagination Meta Builder', () => {
  it('computes correct page and boundary flags', () => {
    const res = buildPaginationResult(['a', 'b'], 25, 2, 10);
    expect(res.meta.totalPages).toBe(3);
    expect(res.meta.hasNextPage).toBe(true);
    expect(res.meta.hasPrevPage).toBe(true);
  });
});
