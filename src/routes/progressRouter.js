import express from 'express';
import { getProgress, updateProgress } from '../controllers/progress-controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/progress/:courseId', authenticateToken, getProgress);
router.post('/progress', authenticateToken, updateProgress);

export default router;