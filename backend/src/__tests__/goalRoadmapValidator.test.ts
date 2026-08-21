import { goalRoadmapCustomizationSchema } from '../validators/goalRoadmap.validator';

describe('Goal Roadmap Customization Validator Schema', () => {
  it('validates target pace hours', () => {
    const res = goalRoadmapCustomizationSchema.safeParse({
      trackId: 'ai-ml-engineer',
      targetPaceHoursPerWeek: 15,
    });
    expect(res.success).toBe(true);
  });
});
