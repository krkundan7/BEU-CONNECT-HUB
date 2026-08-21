import { ITelemetryMetric } from '../types/telemetryTypes';

class TelemetryService {
  private metricsBuffer: ITelemetryMetric[] = [];
  private readonly maxBufferSize = 1000;

  recordMetric(metric: ITelemetryMetric): void {
    this.metricsBuffer.push(metric);
    if (this.metricsBuffer.length > this.maxBufferSize) {
      this.metricsBuffer.shift();
    }
  }

  getSummaryStats() {
    if (!this.metricsBuffer.length) return { count: 0, avgLatencyMs: 0 };
    const totalLatency = this.metricsBuffer.reduce((sum, m) => sum + m.durationMs, 0);
    return {
      count: this.metricsBuffer.length,
      avgLatencyMs: Number((totalLatency / this.metricsBuffer.length).toFixed(2)),
    };
  }
}

export const telemetryService = new TelemetryService();
