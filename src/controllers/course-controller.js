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


export const addCourseSection = async(req,res)=>{
    try {
        const {courseid:courseId} = req.params;
        const addedsectionData = req.body;
       
        const updatedCourse = await courseService.addCourseSection(courseId,addedsectionData);

        res.status(200).json({
            type: "success",
            message: "Course section updated successfully",
            data: updatedCourse
        })
    } catch (error) {
        console.log("Error updating course",error);
        res.status(500).json({
            type: "error",
            message: "Ineternal server error",
            error: error.message
        })
    }
}

export const updateSection = async(req, res) => {
    try {
      const { courseId, sectionId } = req.params; 
      const sectionData = req.body; 
      
      const updatedCourse = await courseService.updataCourseSection(courseId, sectionId, sectionData);
      
      res.status(200).json({
        type: "success",
        message: "Course section updated successfully",
        data: updatedCourse
      });
    } catch (error) {
      console.log("Error updating course", error);
      res.status(500).json({
        type: "error",
        message: "Internal server error",
        error: error.message
      });
    }
  };
  
export const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;  
        const courses = await courseService.getAllCourse(page, limit); 
        res.status(200).json({
            type: "success",
            message: "Courses retrieved successfully",
            data: courses,
        });
    } catch (error) {
        console.error("Error retrieving courses:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getCourseById = async (req, res) => {
    const { courseId } = req.params; 
    try {
        const course = await courseService.getCourseById(courseId); 
        res.status(200).json({
            type: "success",
            message: "Course retrieved successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error retrieving course:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params; 

        const deletedCourse = await courseService.deleteCourse(courseId);

        if (!deletedCourse) {
            return res.status(404).json({
                type: "error",
                message: "Course not found",
            });
        }

        res.status(200).json({
            type: "success",
            message: "Course deleted successfully",
            data: deletedCourse
        });
    } catch (error) {
        console.error("Error in deleteCourse controller:", error);
        res.status(500).json({
            type: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};