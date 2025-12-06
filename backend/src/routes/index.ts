import express from 'express';
import { getRoot } from '../controllers/homeController';

const router = express.Router();

router.get('/', getRoot);

export default router;
