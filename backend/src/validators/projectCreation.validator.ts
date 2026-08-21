import { z } from 'zod';

export const projectCreationSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  techStack: z.array(z.string()).min(1, 'At least one tech stack tag required'),
  requiredRoles: z.array(z.string()).min(1, 'Specify at least one open role'),
});
