import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import { parse } from "csv-parse";
import mongoose from "mongoose";
import Course from "../models/course.js";
import connectDB from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addCourse,
  deleteCourse,
  getCourses,
  getUsers,
} from "../controllers/courseController.js";

const router = Router();

// Resolve CSV path relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.resolve(__dirname, "../scraper/hunter_csci_courses.csv");

let COURSES = [];
connectDB();

function loadCSV() {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => {
        rows.push({
          code: row.code || "",
          title: row.title || "",
          // keep 7-digit string with leading zeros intact
          courseId: (row.course_id ?? "").toString().padStart(7, "0"),
          courseStatus: (row.status ?? "").toString(), // e.g. "Available" | "No Sections"
          users: [],
        });
      })
      .on("end", async () => {
        try {
          await Course.insertMany(rows);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

function matchesQuery(course, qTokens) {
  if (!qTokens.length) return true;
  const hay = `${course.code} ${course.title}`.toLowerCase();
  return qTokens.every((t) => hay.includes(t));
}

// GET /api/courses?query=csci 127&available=1&limit=50
router.get("/courses", async (req, res) => {
  try {
    const query = String(req.query.query ?? "")
      .toLowerCase()
      .trim();
    const onlyAvailable = ["1", "true", "yes"].includes(
      String(req.query.available).toLowerCase()
    );
    const limit = Math.min(parseInt(req.query.limit ?? "50", 10) || 50, 200);

    const filter = {};
    if (query) {
      //filtering to look for by code or title
      filter.$or = [
        { code: { $regex: query, $options: "i" } }, // case-insensitive match
        { title: { $regex: query, $options: "i" } },
      ];
    }
    if (onlyAvailable) {
      filter.courseStatus = "Available";
    }
    const results = await Course.find(filter).limit(limit);
    const total = await Course.countDocuments(filter);

    res.json({ total, items: results });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Load once at startup, then hot-reload on file change
// await loadCSV();
// I added all Data to my mongodb so I commented the line above
// if you didnt for the first time uncomment loadcsv 1 time run server and recomment
// so you can add the data to the db and then readding might cause errors
fs.watchFile(CSV_PATH, { interval: 2000 }, async () => {
  try {
    await loadCSV();
    console.log("[courses] CSV reloaded");
  } catch (e) {
    console.error("[courses] reload failed:", e.message);
  }
});

router.get("/courses/:courseid/users", getUsers);
router.get("/me/courses", authMiddleware, getCourses);
router.post("/me/addcourse/:courseid", authMiddleware, addCourse);
router.delete("/me/deletecourse/:courseid", authMiddleware, deleteCourse);
export default router;
