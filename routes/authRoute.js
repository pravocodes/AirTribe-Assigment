import express from "express";
import {
  LoginController,
  RegisterController,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/register", RegisterController);

export default router;
