import express from "express";
import { registerStudentForCourse } from "../controllers/courseController.js";
const router = express.Router();

router.post("/registerincourse/:id", registerStudentForCourse);

export default router;
