import User from "../models/users.js";
import Instructor from "../models/instructor.js";
import CourseService from "../services/course-services.js";

const courseService = new CourseService();

export const getInstructorSpace = async (subdomain, req, res, next) => {
    try {
        const user = await User.findOne({ subdomain });
        console.log("subdomain", user);

        if (!user) {
            return res.status(404).json({
                message: "Instructor not found",
                success: false,
            });
        }

        const instructor = await Instructor.findOne({ user: user._id });
        console.log("instructor from controller", instructor);
        const courses = await courseService.getAllCourse(); 

        return{  
                name: user.name,
                email: user.email,
                courses: courses, 
                branding: instructor?.branding || "Default Branding",
        };
    } catch (error) {
        next(error); 
    }
};
