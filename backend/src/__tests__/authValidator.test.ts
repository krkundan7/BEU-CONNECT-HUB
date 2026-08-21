import { registrationNumberSchema } from '../validators/registrationNumber.validator';

describe('Registration Validator Schema', () => {
  it('accepts valid 11-digit BEU registration number', () => {
    const result = registrationNumberSchema.safeParse({ registrationNumber: '22101501001' });
    expect(result.success).toBe(true);
  });

  it('rejects alphanumeric registration number', () => {
    const result = registrationNumberSchema.safeParse({ registrationNumber: '22101ABC001' });
    expect(result.success).toBe(false);
  });
});
