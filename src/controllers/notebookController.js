import NotebookService from '../services/notebookService.js';

class NotebookController {
    async createNotebook(req, res) {
        try {
            const notebook = await NotebookService.createNotebook({ ...req.body, owner: req.user.id });
            res.status(201).json({ success: true, data: notebook });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getNotebooks(req, res) {
        try {
            const notebooks = await NotebookService.getNotebooks(req.user.id);
            res.status(200).json({ success: true, data: notebooks });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getNotebookById(req, res) {
        try {
            const notebook = await NotebookService.getNotebookById(req.params.id);
            res.status(200).json({ success: true, data: notebook });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateNotebook(req, res) {
        try {
            const updatedNotebook = await NotebookService.updateNotebook(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedNotebook });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteNotebook(req, res) {
        try {
            await NotebookService.deleteNotebook(req.params.id);
            res.status(204).json({ success: true, message: 'Notebook deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new NotebookController();
