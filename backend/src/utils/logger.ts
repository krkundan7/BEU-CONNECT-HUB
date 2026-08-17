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

  static error(message: string, meta?: any): void {
    // Avoid logging sensitive fields like passwords, tokens or private identifiers
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
