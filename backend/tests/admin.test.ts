import request from 'supertest';
import { createApp } from '../src/app.js';
import { TokenUtils } from '../src/utils/token.js';
import { Role, VerificationStatus } from '@prisma/client';

const app = createApp();

describe('Role-Based Access Control (RBAC) Tests', () => {
  const studentToken = TokenUtils.generateAccessToken({
    id: 'student-uuid-101',
    email: 'student@beu.edu.in',
    role: Role.STUDENT,
    verificationStatus: VerificationStatus.VERIFIED,
  });

  const adminToken = TokenUtils.generateAccessToken({
    id: 'admin-uuid-001',
    email: 'admin@beu.edu.in',
    role: Role.ADMIN,
    verificationStatus: VerificationStatus.VERIFIED,
  });

  it('1. GET /api/admin/dashboard - Denies access to STUDENT role with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('2. GET /api/admin/dashboard - Allows access to ADMIN role', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBeDefined();
  });
});
