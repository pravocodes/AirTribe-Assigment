import express from "express";
import { requireSignIn } from "../Middleware/authMiddleware.js";
import { addCommentController } from "../controllers/commentController.js";
const router = express.Router();

router.post("/add-comment/:id", requireSignIn, addCommentController);

export default router;
