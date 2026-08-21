/**
 * File MIME type detector and extension validator
 */
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export function isMimeTypeAllowed(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType.toLowerCase());
}

export function getFileExtensionFromMime(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'application/pdf': return 'pdf';
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'application/zip': return 'zip';
    default: return 'bin';
  }
}
