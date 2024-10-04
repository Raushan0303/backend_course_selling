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


export const deleteCourseSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params; 

        const updatedCourse = await courseService.deleteCourseSection(courseId, sectionId);
        res.status(200).json({
            type: "success",
            message: "Section deleted successfully",
            data: updatedCourse
        });
    } catch (error) {
        console.error("Error in deleteCourseSection controller:", error);
        res.status(500).json({
            type: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getSectionContent = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const userId = req.user.id;  

        const sectionContent = await courseService.getSectionContent(courseId, sectionId, userId);

        res.status(200).json({
            type: "success",
            message: "Section content retrieved successfully",
            data: sectionContent,
        });
    } catch (error) {
        console.error("Error retrieving section content:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// Update user progress in section
export const updateSectionProgress = async (req, res) => {
    try {
        const { courseId, sectionId } = req.params;
        const { contentIndex } = req.body;
        const userId = req.user.id; 

        const updatedSection = await courseService.updateSectionProgress(courseId, sectionId, userId, contentIndex);

        res.status(200).json({
            type: "success",
            message: "Section progress updated successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Error updating section progress:", error);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
