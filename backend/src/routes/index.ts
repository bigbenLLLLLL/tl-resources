import express from 'express';
import usersRouter from './users';

const router = express.Router();

// Users API
router.use('/users', usersRouter);

export default router;
