# Platform Security & Threat Model Specification

## Security Controls
1. **Password Policy**: Bcrypt hashing with salt rounds = 12.
2. **Brute-force Mitigation**: IP-based and registration-number-based rate limiting (10 attempts / 15 mins).
3. **Strict Content Security Policy**: Helmet-secured HTTP headers preventing XSS, clickjacking, and MIME sniffing.
4. **UIDAI Compliance**: No raw Aadhaar storage; only one-way cryptographic SHA-256 hashes for deduplication.
5. **JWT Token Rotation**: 15-minute access token lifespan with secure HTTP-only refresh tokens.
