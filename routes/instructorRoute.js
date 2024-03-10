import express from "express";
import { isInstructor, requireSignIn } from "../Middleware/authMiddleware.js";
import {
  createCourse,
  searchLeadsController,
  updateCourseDetails,
  updateLeadStatus,
} from "../controllers/courseController.js";
const router = express.Router();

router.post("/createcourse", requireSignIn, isInstructor, createCourse);
router.post(
  "/updatecourse/:id",
  requireSignIn,
  isInstructor,
  updateCourseDetails
);
router.post(
  "/updateleadstatus/:courseId/:leadId",
  requireSignIn,
  isInstructor,
  updateLeadStatus
);

router.get("/searchlead", requireSignIn, isInstructor, searchLeadsController);

export default router;
