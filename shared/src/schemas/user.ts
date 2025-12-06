import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().min(6),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
