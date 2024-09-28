import express from "express";
import { create,addCourseSection,updateSection,getAllCourses,getCourseById,deleteCourse,deleteCourseSection } from "../controllers/course-controller.js";

const router = express.Router();

router.post("/course-create",create);
router.patch("/add-course-section/:courseid",addCourseSection);
router.patch("/update-course-section/:courseId/:sectionId", updateSection);
router.get("/courses", getAllCourses); 
router.get("/course/:courseId", getCourseById);
router.delete("/delete-course/:courseId", deleteCourse);
router.delete("/delete-course-section/:courseId/:sectionId", deleteCourseSection); 


export default router;