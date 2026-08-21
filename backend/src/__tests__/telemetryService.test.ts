import { telemetryService } from '../services/telemetry.service';

describe('Telemetry Service', () => {
  it('records metrics and computes average latency', () => {
    telemetryService.recordMetric({ endpoint: '/api/notices', method: 'GET', statusCode: 200, durationMs: 40, timestamp: Date.now() });
    telemetryService.recordMetric({ endpoint: '/api/syllabus', method: 'GET', statusCode: 200, durationMs: 60, timestamp: Date.now() });
    const stats = telemetryService.getSummaryStats();
    expect(stats.avgLatencyMs).toBe(50);
  });
});
