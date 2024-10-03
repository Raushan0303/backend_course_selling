import User from "../models/users.js";
import Instructor from "../models/instructor.js"; 

export const getInstructorSpace = async (subdomain, req, res, next) => {
    try {
        const user = await User.findOne({ subdomain }).populate("courses");
        console.log("subdomain", user);

        if (!user) {
            return null; 
        }

        const instructor = await Instructor.findOne({ user: user._id });
        console.log("instructor from controller", instructor);

        return {
            name: user.name,
            email: user.email,
            courses: user.courses,
            branding: instructor?.branding || "Default Branding",
        }; 
    } catch (error) {
        next(error); 
    }
};
