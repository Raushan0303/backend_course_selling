import Notebook from '../models/notebook/notebookSchema.js';

class NotebookService {
    async createNotebook(data) {
        try {
            const notebook = new Notebook(data);
            await notebook.save();
            return notebook;
        } catch (error) {
            throw new Error('Error creating notebook: ' + error.message);
        }
    }

    async getNotebooks(ownerId) {
        try {
            const notebooks = await Notebook.find({ owner: ownerId });
            return notebooks;
        } catch (error) {
            throw new Error('Error retrieving notebooks: ' + error.message);
        }
    }

    async getNotebookById(notebookId) {
        try {
            const notebook = await Notebook.findById(notebookId);
            if (!notebook) throw new Error('Notebook not found');
            return notebook;
        } catch (error) {
            throw new Error('Error retrieving notebook: ' + error.message);
        }
    }

    async updateNotebook(notebookId, data) {
        try {
            const updatedNotebook = await Notebook.findByIdAndUpdate(notebookId, data, {
                new: true,
                runValidators: true,
            });
            if (!updatedNotebook) throw new Error('Notebook not found');
            return updatedNotebook;
        } catch (error) {
            throw new Error('Error updating notebook: ' + error.message);
        }
    }

    async deleteNotebook(notebookId) {
        try {
            const deletedNotebook = await Notebook.findByIdAndDelete(notebookId);
            if (!deletedNotebook) throw new Error('Notebook not found');
            return deletedNotebook;
        } catch (error) {
            throw new Error('Error deleting notebook: ' + error.message);
        }
    }
}

export default new NotebookService();
