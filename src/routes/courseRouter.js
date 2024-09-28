import express from "express";
import { create,updateSection } from "../controllers/course-controller.js";

const router = express.Router();

router.post("/course-create",create);
router.patch("/update-course-section/:id",updateSection);



export default router;