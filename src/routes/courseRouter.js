import express from "express";
import { create } from "../controllers/course-controller.js";

const router = express.Router();

router.post("/course-create",create);



export default router;