/**
 * Centralized logging utility formatting ISO-8601 timestamps and serializing contextual metadata.
 */
export class Logger {
  private static format(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`;
  }

  static info(message: string, meta?: any): void {
    console.log(this.format('INFO', message, meta));
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.format('WARN', message, meta));
  }

  /* NOV-COMMENT-47: Error Logging & In-Flight Credential Sanitization
   * Inspects logging metadata and actively strips sensitive security tokens ('password', 'token', 'refreshToken')
   * before printing to standard error streams, preventing accidental credential leaks in cloud log aggregates. */
  static error(message: string, meta?: any): void {
    const sanitizedMeta = meta ? { ...meta } : undefined;
    if (sanitizedMeta && sanitizedMeta.password) delete sanitizedMeta.password;
    if (sanitizedMeta && sanitizedMeta.token) delete sanitizedMeta.token;
    if (sanitizedMeta && sanitizedMeta.refreshToken) delete sanitizedMeta.refreshToken;

    console.error(this.format('ERROR', message, sanitizedMeta));
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.format('DEBUG', message, meta));
    }
  }
}
