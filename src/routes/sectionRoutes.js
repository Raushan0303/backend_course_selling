// src/routes/sectionRoutes.js
import express from 'express';
import SectionController from '../controllers/sectionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router(); // To merge params with notebookId

router.post('/create-section/:notebookId', authenticateToken, SectionController.createSection);

router.get('/get-section', authenticateToken, SectionController.getSections);
router.get('/get-section/:id', authenticateToken, SectionController.getSectionById);
router.put('/:id', authenticateToken, SectionController.updateSection);
router.delete('/:id', authenticateToken, SectionController.deleteSection);

export default router;
