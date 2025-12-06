import express from 'express';
import { register } from '../controllers/userController';

const router = express.Router();

// Create user (registration)
router.post('/', register);

export default router;
