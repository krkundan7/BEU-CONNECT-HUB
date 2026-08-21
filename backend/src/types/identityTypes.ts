export interface IIdentityVerificationPayload {
  aadhaarLast4: string;
  aadhaarChecksumHash: string;
  registrationNumber: string;
  rollNumber: string;
  collegeId: string;
  studentName: string;
  verificationMethod: 'AADHAAR_OTP' | 'COLLEGE_ID_CARD' | 'MANUAL_DEAN';
}
