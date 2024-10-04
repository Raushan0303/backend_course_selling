import express from "express";
import { create, addCourseSection, updateSection, getAllCourses, getCourseById, deleteCourse, deleteCourseSection, updateCourse } from "../controllers/course-controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/course-create", authenticateToken, create);
router.patch("/course/:courseId", authenticateToken, updateCourse);
router.delete("/course/:courseId", authenticateToken, deleteCourse);
router.patch("/add-course-section/:courseid", authenticateToken, addCourseSection);
router.patch("/update-course-section/:courseId/:sectionId", authenticateToken, updateSection);
router.get("/courses", authenticateToken, getAllCourses); 
router.get("/course/:courseId", authenticateToken, getCourseById);
router.delete("/delete-course-section/:courseId/:sectionId", authenticateToken, deleteCourseSection); 

export default router;