import express from "express";
import {
    create,
    addCourseSection,
    updateSection,
    getAllCourses,
    getCourseById,
    deleteCourse,
    deleteCourseSection,
    getSectionContent, 
    updateSectionProgress 
} from "../controllers/course-controller.js";
import { requireInstructorRole,authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/course-create",requireInstructorRole, create);
router.patch("/add-course-section/:courseid",requireInstructorRole, addCourseSection);
router.patch("/update-course-section/:courseId/:sectionId", updateSection);
router.get("/courses", getAllCourses);
router.get("/course/:courseId", getCourseById);
router.delete("/delete-course/:courseId",requireInstructorRole, deleteCourse);
router.delete("/delete-course-section/:courseId/:sectionId",requireInstructorRole, deleteCourseSection);

router.get("/course/:courseId/section/:sectionId/content", getSectionContent);
router.patch("/course/:courseId/section/:sectionId/progress", updateSectionProgress); 

export default router;
