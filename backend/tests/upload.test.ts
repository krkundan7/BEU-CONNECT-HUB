import request from 'supertest';
import { createApp } from '../src/app.js';
import fs from 'fs';
import path from 'path';

describe('Universal File & Document Upload API Test Suite', () => {
  const app = createApp();

  it('1. POST /api/upload - Successfully uploads an image file', async () => {
    // Create a 1x1 dummy PNG buffer
    const dummyPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const res = await request(app)
      .post('/api/upload')
      .attach('file', dummyPng, 'sample_diagram.png');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toMatch(/^\/uploads\//);
    expect(res.body.data.filename).toBe('sample_diagram.png');
  });

  it('2. POST /api/upload/pdf - Successfully uploads a PDF document', async () => {
    const dummyPdf = Buffer.from('%PDF-1.4\n%âãÏÓ\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

    const res = await request(app)
      .post('/api/upload/pdf')
      .attach('document', dummyPdf, 'unit1_notes.pdf');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toMatch(/^\/uploads\/documents\//);
    expect(res.body.data.filename).toBe('unit1_notes.pdf');
  });

  it('3. POST /api/upload/base64 - Successfully converts base64 image data URL to static file', async () => {
    const base64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const res = await request(app)
      .post('/api/upload/base64')
      .send({
        dataUrl: base64Png,
        filename: 'camera_capture.png',
        folder: 'images',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toMatch(/^\/uploads\/images\//);
  });

  it('4. POST /api/upload - Rejects unauthorized executable files (.exe)', async () => {
    const dummyExe = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff');

    const res = await request(app)
      .post('/api/upload')
      .attach('file', dummyExe, 'malicious_script.exe');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
