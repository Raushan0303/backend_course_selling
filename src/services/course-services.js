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
    async updateCourseSection(courseId,sectionData){
        try {
            const findCourse = await Course.findById(courseId);
            console.log("course",findCourse)
            findCourse.sections.push(sectionData);
            const updateData = await findCourse.save()
            return updateData
        } catch (error) {
            console.log("error updating course at service layer",error);
            throw new Error("Error Updating the section at service layer");
        }
    }
}

export default CourseService;