# Performance Benchmarking & Latency Guidelines

## Target Service Level Objectives (SLOs)
- **API Response Latency**: P95 < 120ms for read endpoints; P99 < 350ms for complex queries.
- **Syllabus Tree Fetching**: In-memory static cache response < 15ms.
- **Vite Bundle Size**: Initial chunk < 180kB gzip.
- **Lighthouse Performance Score**: >= 95 across Mobile and Desktop audits.
