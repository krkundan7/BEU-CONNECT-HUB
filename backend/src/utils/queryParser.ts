/**
 * HTTP query parameter parser and sanitizing wrapper
 */
export function parsePaginationQuery(query: any, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  let limit = parseInt(String(query.limit || defaultLimit), 10) || defaultLimit;
  if (limit > maxLimit) limit = maxLimit;
  if (limit < 1) limit = defaultLimit;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
