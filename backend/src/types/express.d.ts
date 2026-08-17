import { Role, VerificationStatus } from '@prisma/client';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
  verificationStatus: VerificationStatus;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
