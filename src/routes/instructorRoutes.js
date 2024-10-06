import express from "express";
import { getInstructorSpace } from "../controllers/instructor-controller.js"; 

const router = express.Router();

router.use((req, res, next) => {
    const host = req.hostname; 
    const subdomain = host.split('.')[0]; 
    console.log("subdomain", subdomain);

    if (subdomain && subdomain !== 'localhost') {
        req.subdomain = subdomain; 
    }
    next();
});

router.use("/", async (req, res, next) => {
    const subdomain = req.subdomain;
    if (subdomain) {
        try {
            const instructor = await getInstructorSpace(subdomain, req, res, next);
            console.log("instructor", instructor);

            if (!instructor) {
                return res.status(404).json({ message: "Instructor not found" });
            }

            res.status(200).json({
                subdomain: subdomain, 
                instructorName: instructor.name,
                courses: instructor.courses,
                details: instructor.details,
            });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    } else {
        next(); 
    }
});

export default router;
