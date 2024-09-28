import CourseService from "../services/course-services.js";

const courseService = new CourseService();


export const create = async(req,res) => {
    try {
        const courseData = req.body;
        console.log("course data: ",courseData)
        const courseCreated = await courseService.createCourse(courseData);

        res.status(200).json({
            type: "Success",
            message: "course created successfully",
            data: courseCreated,
        })
    } catch (error) {
        console.error("Error Creating course", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
}