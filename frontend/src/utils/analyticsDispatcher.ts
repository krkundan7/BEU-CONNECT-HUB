export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[ANALYTICS] ' + eventName, properties);
  }
}
