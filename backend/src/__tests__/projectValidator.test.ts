import { projectCreationSchema } from '../validators/projectCreation.validator';

describe('Project Creation Validator Schema', () => {
  it('validates project title and tech stack', () => {
    const res = projectCreationSchema.safeParse({
      title: 'IoT Smart Campus Monitor',
      description: 'Building an automated IoT energy monitoring system for campus labs',
      techStack: ['Node.js', 'MQTT', 'ESP32'],
      requiredRoles: ['Firmware Engineer', 'Frontend Dev'],
    });
    expect(res.success).toBe(true);
  });
});
