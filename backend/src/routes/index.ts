import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { createUserSchema } from '../../../shared/src/schemas/user';

const router = Router();

router.post('/users', validate(createUserSchema), createUser);

export default router;
