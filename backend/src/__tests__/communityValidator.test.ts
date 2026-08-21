import { communityChannelSchema } from '../validators/communityChannel.validator';

describe('Community Channel Validator Schema', () => {
  it('validates allowed category types', () => {
    const res = communityChannelSchema.safeParse({
      name: 'CSE 2026 Batch',
      category: 'BRANCH',
    });
    expect(res.success).toBe(true);
  });
});
