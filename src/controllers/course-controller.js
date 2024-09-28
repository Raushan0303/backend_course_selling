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
      const { courseId, sectionId } = req.params;  // Retrieve courseId and sectionId from params
      const sectionData = req.body;  // Retrieve section data from the request body
      
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
  