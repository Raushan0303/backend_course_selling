import express from "express";
import { SignUp, googleAuthCallback, signin, verify, googleAuth, getUserDetails } from "../controllers/Users-controllers.js";
import { authenticateToken } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", signin);
router.post("/verify", verify);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/auth/google", googleAuth);
router.get("/user", authenticateToken, getUserDetails); 

export default router;