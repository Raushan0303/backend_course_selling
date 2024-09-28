import express from "express";
import { create,addCourseSection,updateSection } from "../controllers/course-controller.js";

const router = express.Router();

router.post("/course-create",create);
router.patch("/add-course-section/:courseid",addCourseSection);
router.patch("/update-course-section/:courseId/:sectionId", updateSection);


export default router;