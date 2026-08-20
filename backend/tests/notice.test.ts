import request from 'supertest';
import { createApp } from '../src/app.js';
import { TokenUtils } from '../src/utils/token.js';
import { Role } from '@prisma/client';

const app = createApp();

describe('BEU Official Notification API & Personalization Test Suite', () => {
  let studentToken: string;

  beforeAll(() => {
    jest.setTimeout(15000);
    studentToken = TokenUtils.generateAccessToken({
      id: 'student-test-uuid',
      email: 'student@mitmuzaffarpur.ac.in',
      role: Role.STUDENT,
      verificationStatus: 'VERIFIED' as any,
    });
  });

  it('1. GET /api/notices - Returns verified official university notices list', async () => {
    const res = await request(app).get('/api/notices');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const items = Array.isArray(res.body.data) ? res.body.data : res.body.data?.items || [];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(1);

    // Verify first notice has authentic BEU fields
    const firstNotice = items[0];
    expect(firstNotice.title).toBeDefined();
    expect(firstNotice.category).toBeDefined();
    expect(firstNotice.sourceName || firstNotice.source).toBeDefined();
    expect(firstNotice.isOfficial).toBe(true);
  }, 15000);

  it('2. GET /api/notices?branchCode=CSE&semesterNumber=3 - Filters by target branch and semester', async () => {
    const res = await request(app)
      .get('/api/notices')
      .query({ branchCode: 'CSE', semesterNumber: 3 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const items = Array.isArray(res.body.data) ? res.body.data : res.body.data?.items || [];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(1);

    // All returned items must either target CSE / Sem 3 or be universal notices
    for (const item of items) {
      const isUniversal = item.isAllBranches || item.isAllSemesters;
      const matchesBranch = item.targetBranches?.includes('CSE');
      const matchesSem = item.targetSemesters?.includes(3);
      expect(isUniversal || matchesBranch || matchesSem).toBe(true);
    }
  }, 15000);

  it('3. GET /api/notices?category=TIME_TABLE - Filters by category', async () => {
    const res = await request(app)
      .get('/api/notices')
      .query({ category: 'TIME_TABLE' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const items = Array.isArray(res.body.data) ? res.body.data : res.body.data?.items || [];
    expect(Array.isArray(items)).toBe(true);
    for (const item of items) {
      expect(item.category.toUpperCase()).toBe('TIME_TABLE');
    }
  }, 15000);

  it('4. GET /api/notices/for-you - Returns personalized student notice feed with JWT auth', async () => {
    const res = await request(app)
      .get('/api/notices/for-you')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const items = Array.isArray(res.body.data) ? res.body.data : res.body.data?.items || [];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(1);
  }, 15000);

  it('5. GET /api/notices/:id - Retrieves notice detail with authentic PDF link', async () => {
    const listRes = await request(app).get('/api/notices');
    const items = Array.isArray(listRes.body.data) ? listRes.body.data : listRes.body.data?.items || [];
    const targetNotice = items[0];

    const res = await request(app).get(`/api/notices/${targetNotice.id || targetNotice.notificationNumber}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(targetNotice.title);
  }, 15000);
});
