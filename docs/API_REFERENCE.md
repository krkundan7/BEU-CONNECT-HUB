# BEU Connect Hub - REST API Reference Manual

## Standard Response Structure
All REST API endpoints adhere to the JSend-compliant envelope structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "timestamp": "2026-08-21T06:00:00.000Z",
    "requestId": "req_8f1a2e3b"
  }
}
```

## Key Endpoints
- `POST /api/auth/register-verified`: 7-step student registration with identity verification
- `GET /api/academic/syllabus`: Retrieve filtered curriculum tree by branch and semester
- `GET /api/notices/official`: Fetch verified BEU notices with SHA-256 deduplication
- `POST /api/goalmap/recommend`: Generate tailored career pathways
