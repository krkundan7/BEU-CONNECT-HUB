/**
 * Pagination meta-data calculator and cursor builder
 */
export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function buildPaginationResult<T>(
  data: T[],
  totalCount: number,
  page: number,
  limit: number
): PaginationResult<T> {
  const totalPages = Math.ceil(totalCount / limit) || 1;
  return {
    data,
    meta: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
