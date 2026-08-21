# Production Deployment & Infrastructure Runbook

## Dockerized Deployment
- **Frontend**: Multi-stage build with Nginx Alpine static serving.
- **Backend**: Node 22 Alpine runtime with PM2 cluster mode.
- **Database**: Managed PostgreSQL instance with automated daily WAL backups.
- **Reverse Proxy**: Cloudflare CDN with SSL termination and DDoS mitigation.
