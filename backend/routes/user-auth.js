import express from "express";
import {
  getUserData,
  login,
  signup,
  upload,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getUserData);
router.put("/me/uploadimage", authMiddleware, upload);
export default router;
