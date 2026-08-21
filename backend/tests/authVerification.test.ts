import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Privacy-Conscious Student Registration & Multi-Step Verification Suite', () => {
  const app = createApp();

  let beuToken = '';
  let mobileToken = '';
  let emailToken = '';
  let identityToken = '';

  const testRegNo = '23105101099';
  const testMobile = '9876543299';
  const testEmail = 'student.test@beu.edu.in';
  const testPassword = 'Password@123!';

  // ----------------------------------------------------
  // STEP 1: BEU REGISTRATION ID VERIFICATION
  // ----------------------------------------------------
  describe('Step 1: BEU Registration ID Validation', () => {
    it('1.1 should validate a genuine BEU Registration ID and emit a verification token', async () => {
      const res = await request(app)
        .post('/api/auth/verify-beu-reg')
        .send({ beuRegNo: testRegNo });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.valid).toBe(true);
      expect(res.body.data.beuRegNo).toBe(testRegNo);
      expect(res.body.data.verificationToken).toMatch(/^beu_vtoken_/);

      beuToken = res.body.data.verificationToken;
    });

    it('1.2 should reject an invalid BEU Registration format', async () => {
      const res = await request(app)
        .post('/api/auth/verify-beu-reg')
        .send({ beuRegNo: '123' });

      expect([400, 422]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  // ----------------------------------------------------
  // STEP 3: MOBILE OTP VERIFICATION
  // ----------------------------------------------------
  describe('Step 3: Mobile Phone OTP Lifecycle', () => {
    let demoOtp = '';

    it('3.1 should send a 6-digit OTP to mobile with cooldown', async () => {
      const res = await request(app)
        .post('/api/auth/send-mobile-otp')
        .send({ mobile: testMobile });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cooldownSeconds).toBe(60);

      demoOtp = res.body.data.demoOtp;
      expect(demoOtp).toHaveLength(6);
    });

    it('3.2 should enforce 60-second cooldown on immediate resend', async () => {
      const res = await request(app)
        .post('/api/auth/send-mobile-otp')
        .send({ mobile: testMobile });

      expect(res.status).toBe(400);
      const msg = res.body.error?.message || res.body.message;
      expect(msg).toMatch(/Please wait \d+ seconds/);
    });

    it('3.3 should reject an incorrect OTP and decrement remaining attempts', async () => {
      const res = await request(app)
        .post('/api/auth/verify-mobile-otp')
        .send({ mobile: testMobile, otp: '000000' });

      expect(res.status).toBe(400);
      const msg = res.body.error?.message || res.body.message;
      expect(msg).toMatch(/Incorrect OTP/);
    });

    it('3.4 should verify the genuine OTP and emit mobileToken', async () => {
      const res = await request(app)
        .post('/api/auth/verify-mobile-otp')
        .send({ mobile: testMobile, otp: demoOtp });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verified).toBe(true);
      expect(res.body.data.verificationToken).toMatch(/^otp_vtoken_/);

      mobileToken = res.body.data.verificationToken;
    });
  });

  // ----------------------------------------------------
  // STEP 4: EMAIL OTP VERIFICATION
  // ----------------------------------------------------
  describe('Step 4: Email OTP Lifecycle', () => {
    let demoOtp = '';

    it('4.1 should dispatch email verification OTP', async () => {
      const res = await request(app)
        .post('/api/auth/send-email-otp')
        .send({ email: testEmail });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      demoOtp = res.body.data.demoOtp;
    });

    it('4.2 should verify email OTP and emit emailToken', async () => {
      const res = await request(app)
        .post('/api/auth/verify-email-otp')
        .send({ email: testEmail, otp: demoOtp });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verified).toBe(true);
      expect(res.body.data.verificationToken).toMatch(/^otp_vtoken_/);

      emailToken = res.body.data.verificationToken;
    });
  });

  // ----------------------------------------------------
  // STEP 5: PRIVACY-CONSCIOUS IDENTITY VERIFICATION
  // ----------------------------------------------------
  describe('Step 5: Privacy-Conscious Identity Verification (UIDAI/DigiLocker)', () => {
    let referenceId = '';

    it('5.1 should initiate identity verification with mandatory consent and mask Aadhaar', async () => {
      const res = await request(app)
        .post('/api/auth/verify-identity/initiate')
        .send({
          aadhaarNumber: '555566667777',
          studentName: 'Aman Kumar',
          consentGiven: true,
          dob: '2004-05-15',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maskedAadhaar).toBe('XXXX-XXXX-7777');
      expect(res.body.data.status).toBe('PENDING_OTP');
      expect(res.body.data.referenceId).toMatch(/^idv_ref_/);

      // Verify zero plaintext Aadhaar leakage in response
      expect(JSON.stringify(res.body)).not.toContain('555566667777');

      referenceId = res.body.data.referenceId;
    });

    it('5.2 should confirm identity OTP and emit identity verification token', async () => {
      const res = await request(app)
        .post('/api/auth/verify-identity/confirm')
        .send({ referenceId, otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('VERIFIED');
      expect(res.body.data.verificationToken).toMatch(/^idv_token_/);

      identityToken = res.body.data.verificationToken;
    });
  });

  // ----------------------------------------------------
  // STEP 7: FINAL ACCOUNT ACTIVATION
  // ----------------------------------------------------
  describe('Step 7: Final Verified Account Creation', () => {
    it('7.1 should reject registration if verification tokens are missing or fraudulent', async () => {
      const res = await request(app)
        .post('/api/auth/register-verified')
        .send({
          name: 'Aman Kumar',
          email: testEmail,
          password: testPassword,
          mobile: testMobile,
          college: 'Muzaffarpur Institute of Technology',
          branch: 'Computer Science & Engineering',
          semester: 3,
          beuRegNo: testRegNo,
          beuToken: 'invalid_token',
          mobileToken: 'invalid_token',
          emailToken: 'invalid_token',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('7.2 should activate and register student account with all verified tokens', async () => {
      const res = await request(app)
        .post('/api/auth/register-verified')
        .send({
          name: 'Aman Kumar',
          email: testEmail,
          password: testPassword,
          mobile: testMobile,
          college: 'Muzaffarpur Institute of Technology',
          branch: 'Computer Science & Engineering',
          semester: 3,
          beuRegNo: testRegNo,
          beuToken,
          mobileToken,
          emailToken,
          identityToken,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.accessToken).toBeDefined();
    });
  });

  // ----------------------------------------------------
  // MULTI-IDENTIFIER LOGIN & BRUTE-FORCE DEFENSE
  // ----------------------------------------------------
  describe('Multi-Identifier Login & Brute-Force Lockout', () => {
    it('8.1 should login successfully using Email + Password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it('8.2 should login successfully using BEU Registration ID + Password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: testRegNo, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('8.3 should login successfully using Mobile Number + Password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: testMobile, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('8.4 should trigger progressive account lockout after 5 consecutive failed attempts', async () => {
      const badId = 'brute.force.victim@beu.edu.in';

      // 4 failed attempts
      for (let i = 0; i < 4; i++) {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ identifier: badId, password: 'WrongPassword123!' });

        expect(res.status).toBe(401);
        const msg = res.body.error?.message || res.body.message;
        expect(msg).toMatch(/attempt\(s\) remaining/);
      }

      // 5th failed attempt -> 429 Too Many Requests Lockout
      const lockoutRes = await request(app)
        .post('/api/auth/login')
        .send({ identifier: badId, password: 'WrongPassword123!' });

      expect(lockoutRes.status).toBe(429);
      const lockMsg = lockoutRes.body.error?.message || lockoutRes.body.message;
      expect(lockMsg).toMatch(/Account is locked for 15 minutes/);
    });
  });
});
