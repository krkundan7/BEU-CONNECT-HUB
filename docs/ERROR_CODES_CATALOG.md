# API Error Codes Catalog & Resolution Guide

| Error Code | HTTP Status | Meaning | Resolution |
|---|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | 401 | Email/Password mismatch | Retry credentials |
| `AUTH_OTP_EXPIRED` | 400 | Registration OTP timed out | Request new OTP |
| `ACAD_BRANCH_NOT_FOUND` | 404 | Unknown BEU branch code | Refer to official 34 branches |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait 60 seconds |
