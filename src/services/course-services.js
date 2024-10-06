import Course from "../models/course_scehma.js";


class CourseService {
    async createCourse(data){
        try {
            const createdCourse = await Course.create(data);
            return createdCourse;
        } catch (error) {
            console.log("Error creating course,", error);
            throw new Error("Error creating cousre");
        }
    }
    async addCourseSection(courseId,addedsectionData){
        try {
            const findCourse = await Course.findById(courseId);
            if (!findCourse) {
                throw new Error("Course not found");
               }
            console.log("course",findCourse)
            findCourse.sections.push(addedsectionData);
            const updateData = await findCourse.save()
            return updateData
        } catch (error) {
            console.log("error updating course at service layer",error);
            throw new Error("Error Updating the section at service layer");
        }
    }

    async updataCourseSection(courseId,sectionId,data){
        try {
            const findCourse = await Course.findById(courseId);
                if (!findCourse) {
                throw new Error("Course not found");
               }
              const sectionIndex = findCourse.sections.findIndex(section => section._id.toString() === sectionId);
    
              if (sectionIndex === -1) {
                throw new Error("Section not found");
              }
              findCourse.sections[sectionIndex] = { ...findCourse.sections[sectionIndex].toObject(), ...data };
    
              const updatedCourse = await findCourse.save();
              
              return updatedCourse;

        } catch (error) {
            
        }
    }

    async getAllCourse(page=1,limit=10){
        try {
            const pageInt = parseInt(page,10);
            const limitInt = parseInt(limit,10);

            const offSet = (pageInt-1) * limitInt;

            const allCourses = await Course.find().skip(offSet).limit(limitInt);

            if(!allCourses.length){
                throw new Error("Course not found");
            }
            return allCourses;
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw new Error("Error fetching courses");
        }
        
    }
    async getCourseById(courseId) {
        try {
            const course = await Course.findById(courseId).populate('sections.content'); 
            if (!course) {
                throw new Error("Course not found");
            }
            return course;
        } catch (error) {
            console.error("Error fetching course by ID:", error);
            throw new Error("Error fetching course");
        }
    }

    async deleteCourse(courseId){
        try {
            const deleteCourse = await Course.findByIdAndDelete(courseId);
            return deleteCourse;
        } catch (error) {
            console.error("Error deleting course by ID:", error);
            throw new Error("Error deleting course");
        }
    }
    async deleteCourseSection(courseId, sectionId) {
        try {
            const course = await Course.findById(courseId);
    
            if (!course) {
                throw new Error("Course not found");
            }
    
            const updatedSections = course.sections.filter(section => section._id.toString() !== sectionId);
    
            course.sections = updatedSections;
    
            const updatedCourse = await course.save();
            return updatedCourse;
        } catch (error) {
            console.error("Error deleting section from course:", error);
            throw new Error("Error deleting section from course");
        }
    }

    async updateCourse(courseId, updateData) {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
            if (!updatedCourse) {
                throw new Error("Course not found");
            }
            return updatedCourse;
        } catch (error) {
            console.error("Error updating course:", error);
            throw new Error("Error updating course");
        }
    }
    
    async getSectionContent(courseId, sectionId, userId) {
        try {
            const course = await Course.findById(courseId).populate('sections.content');
            if (!course) {
                throw new Error("Course not found");
            }

            const section = course.sections.id(sectionId);
            if (!section) {
                throw new Error("Section not found");
            }

            // Find the user's interaction history with this section
            const userHistory = section.interactionHistory.find(h => h.userId.toString() === userId);
            let contentIndex = userHistory ? userHistory.currentContentIndex : 0;

            // Return the content and user progress in this section
            return {
                sectionTitle: section.sectionTitle,
                content: section.content[contentIndex], // Return the next content
                contentIndex,
            };
        } catch (error) {
            console.log("Error fetching section content:", error);
            throw new Error("Error fetching section content");
        }
    }

    // Update user progress in section
    async updateSectionProgress(courseId, sectionId, userId, contentIndex) {
        try {
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error("Course not found");
            }

            const section = course.sections.id(sectionId);
            if (!section) {
                throw new Error("Section not found");
            }

            // Find or create the user's history entry for the section
            let userHistory = section.interactionHistory.find(h => h.userId.toString() === userId);
            if (!userHistory) {
                userHistory = { userId, currentContentIndex: contentIndex };
                section.interactionHistory.push(userHistory);
            } else {
                userHistory.currentContentIndex = contentIndex;
                userHistory.lastAccessedAt = Date.now();
            }

            await course.save();
            return section;
        } catch (error) {
            console.log("Error updating section progress:", error);
            throw new Error("Error updating section progress");
        }
    }
}

export default CourseService;