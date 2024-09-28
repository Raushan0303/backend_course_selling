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
}

export default CourseService;