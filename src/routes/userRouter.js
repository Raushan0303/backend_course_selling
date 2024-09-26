import express from "express";
import { SignUp,signin,verify } from "../controllers/Users-controllers.js";

const router = express.Router();

router.post("/signup",SignUp);
router.post("/signin",signin);
router.post("/verify",verify);


export default router;