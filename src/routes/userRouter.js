import express from "express";
import { SignUp,googleAuthCallback,signin,verify,googleAuth } from "../controllers/Users-controllers.js";

const router = express.Router();

router.post("/signup",SignUp);
router.post("/signin",signin);
router.post("/verify",verify);
router.get("/auth/google/callback",googleAuthCallback)
router.get("/auth/google",googleAuth)


export default router;