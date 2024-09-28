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
}

export default CourseService;