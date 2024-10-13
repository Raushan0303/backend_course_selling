import Section from '../models/sectionSchema.js';
import Notebook from '../models/notebookSchema.js';

class SectionService {
    async createSection(title,notebookId) {
        try {
            const notebook = await Notebook.findOne(notebookId);
            console.log("notebook",notebook)

            const section = new Section(title);
            console.log("section",section)
            await section.save();
            notebook.sections.push(
               section._id
           )
            await notebook.save();
            return section;
        } catch (error) {
            throw new Error('Error creating section: ' + error.message);
        }
    }

    async getSections(notebookId) {
        try {
            const sections = await Section.find({ notebook: notebookId });
            return sections;
        } catch (error) {
            throw new Error('Error retrieving sections: ' + error.message);
        }
    }

    async getSectionById(sectionId) {
        try {
            const section = await Section.findById(sectionId);
            if (!section) throw new Error('Section not found');
            return section;
        } catch (error) {
            throw new Error('Error retrieving section: ' + error.message);
        }
    }

    async updateSection(sectionId, data) {
        try {
            const updatedSection = await Section.findByIdAndUpdate(sectionId, data, {
                new: true,
                runValidators: true,
            });
            if (!updatedSection) throw new Error('Section not found');
            return updatedSection;
        } catch (error) {
            throw new Error('Error updating section: ' + error.message);
        }
    }

    async deleteSection(sectionId) {
        try {
            const deletedSection = await Section.findByIdAndDelete(sectionId);
            if (!deletedSection) throw new Error('Section not found');
            return deletedSection;
        } catch (error) {
            throw new Error('Error deleting section: ' + error.message);
        }
    }
}

export default new SectionService();
