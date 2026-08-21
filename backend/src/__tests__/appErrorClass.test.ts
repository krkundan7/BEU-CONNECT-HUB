import { AppError } from '../utils/AppError';

describe('AppError Class', () => {
  it('correctly sets status code and operational flag', () => {
    const err = new AppError('Unauthorized Resource', 401);
    expect(err.statusCode).toBe(401);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('Unauthorized Resource');
  });
});
