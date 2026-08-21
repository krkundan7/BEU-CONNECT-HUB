import { userSettingsSchema } from '../validators/userSettings.validator';

describe('User Settings Validator Schema', () => {
  it('validates theme preference enum', () => {
    const res = userSettingsSchema.safeParse({ themePreference: 'DARK' });
    expect(res.success).toBe(true);
  });
});
