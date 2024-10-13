// src/routes/notebookRoutes.js
import express from 'express';
import NotebookController from '../controllers/notebookController.js';
import { authenticateToken } from '../middleware/auth.js';// Assuming you have authentication middleware

const router = express.Router();

router.route('/')
    .post(authenticateToken, NotebookController.createNotebook)
    .get(protect, NotebookController.getNotebooks);

router.route('/:id')
    .get(authenticateToken, NotebookController.getNotebookById)
    .put(authenticateToken, NotebookController.updateNotebook)
    .delete(authenticateToken, NotebookController.deleteNotebook);

export default router;
