import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface LoginResponse {
  token: string;
  id: number;
}
