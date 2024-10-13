import SectionService from '../services/sectionService.js';

class SectionController {
    async createSection(req, res) {
        try {

            const notebookId = req.params.notebookId;
            const {title} = req.query;
            // console.log("data",title)
            const section = await SectionService.createSection({ title,notebookId });
            res.status(201).json({ success: true, data: section });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getSections(req, res) {
        try {
            const sections = await SectionService.getSections(req.params.notebookId);
            res.status(200).json({ success: true, data: sections });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getSectionById(req, res) {
        try {
            const section = await SectionService.getSectionById(req.params.id);
            res.status(200).json({ success: true, data: section });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateSection(req, res) {
        try {
            const updatedSection = await SectionService.updateSection(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedSection });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteSection(req, res) {
        try {
            await SectionService.deleteSection(req.params.id);
            res.status(204).json({ success: true, message: 'Section deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new SectionController();
