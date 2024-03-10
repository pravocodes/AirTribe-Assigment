import express from "express";
import { isInstructor, requireSignIn } from "../Middleware/authMiddleware.js";
import { createCourse, updateCourseDetails } from "../controllers/courseController.js";
const router = express.Router();

router.post("/createcourse",requireSignIn, isInstructor, createCourse);
router.post("/updatecourse/:id", requireSignIn, isInstructor, updateCourseDetails);


export default router;
