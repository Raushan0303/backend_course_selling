// src/routes/notebookRoutes.js
import express from 'express';
import NotebookController from '../controllers/notebookController.js';
import { authenticateToken } from '../middleware/auth.js';// Assuming you have authentication middleware

const router = express.Router();

router.post('/create-notebook',authenticateToken, NotebookController.createNotebook)
router.get("/get-notebook",authenticateToken, NotebookController.getNotebooks);

router.get('/get-notebook/:id',authenticateToken, NotebookController.getNotebookById)
router.put('update-notebook/:id',authenticateToken, NotebookController.updateNotebook)
router.delete('delete-notebook/:id',authenticateToken, NotebookController.deleteNotebook);

export default router;
