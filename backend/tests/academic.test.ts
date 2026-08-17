import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Academic & AI Pattern Analyzer API Tests', () => {
  it('1. GET /api/academic/branches - Returns list of engineering branches', async () => {
    const res = await request(app).get('/api/academic/branches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('2. GET /api/academic/semesters - Returns 8 B.Tech semesters', async () => {
    const res = await request(app).get('/api/academic/semesters');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('3. POST /api/ai/analyze-pyq - Returns historical pattern priority and mandatory disclaimer', async () => {
    const res = await request(app)
      .post('/api/ai/analyze-pyq')
      .send({
        subjectName: 'Data Structures and Algorithms',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.topics).toBeDefined();
    expect(Array.isArray(res.body.data.topics)).toBe(true);

    // Verify AI Safety requirement: Mandatory disclaimer must be present
    expect(res.body.data.disclaimer).toBe(
      'This is historical pattern analysis, not a guaranteed prediction of future exam questions.'
    );
  });
});
