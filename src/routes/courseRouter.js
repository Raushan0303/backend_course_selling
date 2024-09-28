import express from "express";
import { create,addCourseSection,updateSection,getAllCourses,getCourseById } from "../controllers/course-controller.js";

const router = express.Router();

router.post("/course-create",create);
router.patch("/add-course-section/:courseid",addCourseSection);
router.patch("/update-course-section/:courseId/:sectionId", updateSection);
router.get("/courses", getAllCourses); 
router.get("/course/:courseId", getCourseById);


export default router;