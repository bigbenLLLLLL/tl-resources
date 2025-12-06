import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { login } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { createUserSchema } from '../../../shared/src/schemas/user';
import { z } from 'zod';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

const router = Router();

router.post('/users', validate(createUserSchema), createUser);
router.post('/auth/login', validate(loginSchema), login);

export default router;
