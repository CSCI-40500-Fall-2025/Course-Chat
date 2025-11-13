import express from "express";
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/announcements/:courseId", authMiddleware, addAnnouncement);
router.put(
  "/announcements/:announcementId",
  authMiddleware,
  updateAnnouncement
);
router.delete(
  "/announcements/:announcementId",
  authMiddleware,
  deleteAnnouncement
);
router.get("/announcements/:courseId", authMiddleware, getAnnouncements);

export default router;
