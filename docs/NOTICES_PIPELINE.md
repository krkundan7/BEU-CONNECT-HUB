# BEU Official Notice Ingestion Pipeline

## Verification Workflow
1. Notice scraping or admin upload.
2. Content normalization and SHA-256 fingerprint generation.
3. Deduplication check against past 180 days records.
4. Branch and semester targeting tag extraction.
5. Real-time push notification dispatch to subscribed student clients.
