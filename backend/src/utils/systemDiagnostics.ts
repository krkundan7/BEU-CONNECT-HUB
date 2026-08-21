/**
 * Memory usage and system health diagnostic helper
 */
export function getSystemDiagnostics() {
  const memoryUsage = process.memoryUsage();
  return {
    uptimeSeconds: Math.floor(process.uptime()),
    heapUsedMB: Number((memoryUsage.heapUsed / 1024 / 1024).toFixed(2)),
    heapTotalMB: Number((memoryUsage.heapTotal / 1024 / 1024).toFixed(2)),
    rssMB: Number((memoryUsage.rss / 1024 / 1024).toFixed(2)),
    nodeVersion: process.version,
    platform: process.platform,
  };
}
