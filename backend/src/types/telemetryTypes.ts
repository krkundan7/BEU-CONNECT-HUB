export interface ITelemetryMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  durationMs: number;
  timestamp: number;
}
