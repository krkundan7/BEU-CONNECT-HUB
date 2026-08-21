/**
 * Base64 data URL parser and validator
 */
export function parseBase64DataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([a-zA-Z0-9\/\+\-]+);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');
  return { mimeType, buffer };
}
