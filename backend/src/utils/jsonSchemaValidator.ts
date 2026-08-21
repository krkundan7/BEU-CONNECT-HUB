/**
 * JSON schema lightweight validator helper
 */
export function validateObjectKeys(obj: Record<string, any>, requiredKeys: string[]): { valid: boolean; missing: string[] } {
  const missing = requiredKeys.filter((k) => obj[k] === undefined || obj[k] === null || obj[k] === '');
  return {
    valid: missing.length === 0,
    missing,
  };
}
