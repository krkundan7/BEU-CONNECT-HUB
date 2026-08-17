import request from 'supertest';
import { createApp } from '../src/app.js';
import prisma from '../src/config/prisma.js';

const app = createApp();

describe('Authentication & Security Tests', () => {
  const testEmail = `test.student.${Date.now()}@beu.edu.in`;
  const testPassword = 'Password123';
  const testRegNo = `REG-${Date.now()}`;
  let accessToken: string;
  let refreshToken: string;

  afterAll(async () => {
    // Cleanup created test user
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
    await prisma.$disconnect();
  });

  it('1. POST /api/auth/register - Successfully registers new BEU student with hashed password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: testEmail,
        password: testPassword,
        college: 'Muzaffarpur Institute of Technology',
        branch: 'Computer Science and Engineering',
        semester: 3,
        beuRegNo: testRegNo,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.user.role).toBe('STUDENT');
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    // Verify password is NOT returned in plain text or hash
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
    // Verify BEU Registration Number is NOT exposed in public object
    expect(res.body.data.user.beuRegNo).toBeUndefined();

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('2. POST /api/auth/register - Rejects duplicate email registration with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Student',
        email: testEmail,
        password: testPassword,
        college: 'MIT Muzaffarpur',
        branch: 'CSE',
        semester: 3,
        beuRegNo: `DIFF-${Date.now()}`,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('3. POST /api/auth/login - Rejects invalid password with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword999',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('4. POST /api/auth/login - Successfully logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('5. GET /api/auth/me - Returns current user details when authorized', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testEmail);
  });

  it('6. GET /api/auth/me - Rejects unauthorized requests without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
